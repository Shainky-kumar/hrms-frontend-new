// // // "use client";

// // // import { useState, useEffect } from "react";
// // // import { useForm } from "react-hook-form";
// // // import { zodResolver } from "@hookform/resolvers/zod";
// // // import { z } from "zod";
// // // import { toast } from "sonner";
// // // import { Loader2, Save, X, Pencil, Eye, Building2, Mail, Phone, MapPin } from "lucide-react";
// // // import { api } from "@/lib/api";
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";

// // // // Matches CreateCompany schema fields used on form
// // // const companySchema = z.object({
// // //   company_name: z.string().min(2, "Company name is required"),
// // //   company_email: z.string().email("Valid email is required"),
// // //   company_mobile: z.string().min(10, "Valid phone number is required"),
// // //   company_address: z.string().optional(),
// // //   company_city: z.string().optional(),
// // //   company_state: z.string().optional(),
// // //   company_country: z.string().optional(),
// // //   company_zipcode: z.string().optional(),
// // //   company_landline: z.string().optional(),
// // //   company_logo: z.string().optional(),
// // // });

// // // export default function CompanyConfigPage() {
// // //   const [loading, setLoading] = useState(true);
// // //   const [saving, setSaving] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [companyId, setCompanyId] = useState("");
// // //   const [mode, setMode] = useState("view"); // view | edit
// // //   const [company, setCompany] = useState(null);

// // //   const {
// // //     register,
// // //     handleSubmit,
// // //     formState: { errors },
// // //     reset,
// // //   } = useForm({
// // //     resolver: zodResolver(companySchema),
// // //     mode: "onBlur",
// // //     defaultValues: {
// // //       company_name: "",
// // //       company_email: "",
// // //       company_mobile: "",
// // //       company_address: "",
// // //       company_city: "",
// // //       company_state: "",
// // //       company_country: "",
// // //       company_zipcode: "",
// // //       company_landline: "",
// // //       company_logo: "",
// // //     },
// // //   });

// // //   useEffect(() => {
// // //     fetchCompanyDetails();
// // //   }, []);

// // //   const fetchCompanyDetails = async () => {
// // //     setLoading(true);
// // //     setError("");
// // //     try {
// // //       const res = await api.get("/api/v1/get/company", {
// // //         params: { page: 1, page_size: 1 },
// // //       });

// // //       const body = res?.data ?? {};

// // //       let data = null;
// // //       if (Array.isArray(body.check_existing) && body.check_existing.length > 0) {
// // //         data = body.check_existing[0];
// // //       } else if (body.data) {
// // //         data = Array.isArray(body.data) ? body.data[0] : body.data;
// // //       } else if (body.company_id) {
// // //         data = body;
// // //       }

// // //       if (!data || !data.company_id) {
// // //         setError("Company details not found");
// // //         setLoading(false);
// // //         return;
// // //       }

// // //       setCompanyId(data.company_id);
// // //       setCompany(data);

// // //       reset({
// // //         company_name: data.company_name || "",
// // //         company_email: data.company_email || "",
// // //         company_mobile: data.company_mobile || "",
// // //         company_address: data.company_address || "",
// // //         company_city: data.company_city || "",
// // //         company_state: data.company_state || "",
// // //         company_country: data.company_country || "",
// // //         company_zipcode: data.company_zipcode || "",
// // //         company_landline: data.company_landline || "",
// // //         company_logo: data.company_logo || "",
// // //       });
// // //     } catch (err) {
// // //       const msg = err?.response?.data?.detail || "Failed to load company details";
// // //       setError(typeof msg === "string" ? msg : "Failed to load company details");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const onSubmit = async (values) => {
// // //     if (!companyId) {
// // //       toast.error("Company ID not found");
// // //       return;
// // //     }

// // //     setSaving(true);
// // //     setError("");
// // //     try {
// // //       // CreateCompany schema requires first_name, last_name, password
// // //       // Backend update should ignore these for company-only update
// // //       const payload = {
// // //         company_name: values.company_name,
// // //         company_email: values.company_email,
// // //         company_mobile: values.company_mobile,
// // //         company_address: values.company_address || null,
// // //         company_city: values.company_city || null,
// // //         company_state: values.company_state || null,
// // //         company_country: values.company_country || null,
// // //         company_zipcode: values.company_zipcode || null,
// // //         company_landline: values.company_landline || null,
// // //         company_logo: values.company_logo || null,
// // //         first_name: "Admin",
// // //         last_name: "User",
// // //         password: "NoChange@12345",
// // //         profile_pic: null,
// // //       };

// // //       const res = await api.put(`/api/v1/update/company/${companyId}`, payload);

// // //       if (res.data?.success || res.status === 200) {
// // //         toast.success("Company details updated successfully!");
// // //         setMode("view");
// // //         await fetchCompanyDetails();
// // //       }
// // //     } catch (err) {
// // //       const errorMsg = err?.response?.data?.detail || "Failed to update company details";
// // //       const msg = typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg);
// // //       setError(msg);
// // //       toast.error(msg);
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   const startEdit = () => {
// // //     setError("");
// // //     setMode("edit");
// // //   };

// // //   const cancelEdit = () => {
// // //     setError("");
// // //     setMode("view");
// // //     if (company) {
// // //       reset({
// // //         company_name: company.company_name || "",
// // //         company_email: company.company_email || "",
// // //         company_mobile: company.company_mobile || "",
// // //         company_address: company.company_address || "",
// // //         company_city: company.company_city || "",
// // //         company_state: company.company_state || "",
// // //         company_country: company.company_country || "",
// // //         company_zipcode: company.company_zipcode || "",
// // //         company_landline: company.company_landline || "",
// // //         company_logo: company.company_logo || "",
// // //       });
// // //     }
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="flex items-center justify-center min-h-[60vh]">
// // //         <div className="flex flex-col items-center gap-3">
// // //           <Loader2 className="h-8 w-8 animate-spin text-primary" />
// // //           <p className="text-slate-600 text-sm">Loading company details...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   /* ========== VIEW MODE ========== */
// // //   if (mode === "view") {
// // //     return (
// // //       <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
// // //         <div className="flex items-center justify-between">
// // //           <div>
// // //             <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
// // //             <p className="text-slate-600 mt-1 text-sm">View and manage your company details</p>
// // //           </div>
// // //           <Button onClick={startEdit} className="gap-2">
// // //             <Pencil className="h-4 w-4" />
// // //             Edit Details
// // //           </Button>
// // //         </div>

// // //         {error && (
// // //           <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
// // //             <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
// // //             <button type="button" onClick={() => setError("")} className="text-red-500">
// // //               <X className="h-4 w-4" />
// // //             </button>
// // //           </div>
// // //         )}

// // //         <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
// // //           <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-6 text-white">
// // //             <div className="flex items-start gap-4">
// // //               {company?.company_logo ? (
// // //                 <img
// // //                   src={company.company_logo}
// // //                   alt="Logo"
// // //                   className="h-14 w-14 rounded-lg bg-white object-contain p-1"
// // //                 />
// // //               ) : (
// // //                 <div className="h-14 w-14 rounded-lg bg-white/10 flex items-center justify-center">
// // //                   <Building2 className="h-7 w-7 text-white/80" />
// // //                 </div>
// // //               )}
// // //               <div>
// // //                 <h2 className="text-xl font-semibold">{company?.company_name || "—"}</h2>
// // //                 <p className="text-slate-300 text-sm mt-0.5">{company?.company_email || "—"}</p>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="p-6 grid gap-6 md:grid-cols-2">
// // //             <div className="space-y-4">
// // //               <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Contact</h3>
// // //               <div className="flex items-start gap-3">
// // //                 <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
// // //                 <div>
// // //                   <p className="text-xs text-slate-500">Email</p>
// // //                   <p className="text-sm font-medium text-slate-900">{company?.company_email || "—"}</p>
// // //                 </div>
// // //               </div>
// // //               <div className="flex items-start gap-3">
// // //                 <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
// // //                 <div>
// // //                   <p className="text-xs text-slate-500">Mobile</p>
// // //                   <p className="text-sm font-medium text-slate-900">{company?.company_mobile || "—"}</p>
// // //                 </div>
// // //               </div>
// // //               {company?.company_landline && (
// // //                 <div className="flex items-start gap-3">
// // //                   <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
// // //                   <div>
// // //                     <p className="text-xs text-slate-500">Landline</p>
// // //                     <p className="text-sm font-medium text-slate-900">{company.company_landline}</p>
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>

// // //             <div className="space-y-4">
// // //               <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Address</h3>
// // //               <div className="flex items-start gap-3">
// // //                 <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
// // //                 <div>
// // //                   <p className="text-xs text-slate-500">Full Address</p>
// // //                   <p className="text-sm font-medium text-slate-900">
// // //                     {[
// // //                       company?.company_address,
// // //                       company?.company_city,
// // //                       company?.company_state,
// // //                       company?.company_country,
// // //                       company?.company_zipcode,
// // //                     ]
// // //                       .filter(Boolean)
// // //                       .join(", ") || "—"}
// // //                   </p>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex justify-end">
// // //             <Button onClick={startEdit} variant="outline" className="gap-2">
// // //               <Pencil className="h-4 w-4" />
// // //               Edit Details
// // //             </Button>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   /* ========== EDIT MODE ========== */
// // //   return (
// // //     <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
// // //       <div className="flex items-center justify-between">
// // //         <div>
// // //           <h1 className="text-2xl font-bold text-slate-900">Edit Company Details</h1>
// // //           <p className="text-slate-600 mt-1 text-sm">Update information used on letters and documents</p>
// // //         </div>
// // //         <Button type="button" variant="outline" onClick={cancelEdit} className="gap-2">
// // //           <Eye className="h-4 w-4" />
// // //           View Details
// // //         </Button>
// // //       </div>

// // //       {error && (
// // //         <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
// // //           <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
// // //           <button type="button" onClick={() => setError("")} className="text-red-500">
// // //             <X className="h-4 w-4" />
// // //           </button>
// // //         </div>
// // //       )}

// // //       <form
// // //         onSubmit={handleSubmit(onSubmit)}
// // //         className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 md:p-8 space-y-8"
// // //       >
// // //         <div className="space-y-5">
// // //           <div>
// // //             <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
// // //             <p className="text-sm text-slate-500 mt-0.5">Core company details</p>
// // //           </div>

// // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// // //             <div className="space-y-2">
// // //               <Label htmlFor="company_name">Company Name *</Label>
// // //               <Input id="company_name" placeholder="Your Company Name" className="h-10" {...register("company_name")} />
// // //               {errors.company_name && <p className="text-xs text-red-500">{errors.company_name.message}</p>}
// // //             </div>

// // //             <div className="space-y-2">
// // //               <Label htmlFor="company_email">Email Address *</Label>
// // //               <Input id="company_email" type="email" placeholder="company@example.com" className="h-10" {...register("company_email")} />
// // //               {errors.company_email && <p className="text-xs text-red-500">{errors.company_email.message}</p>}
// // //             </div>

// // //             <div className="space-y-2">
// // //               <Label htmlFor="company_mobile">Mobile *</Label>
// // //               <Input id="company_mobile" placeholder="+91 98765 43210" className="h-10" {...register("company_mobile")} />
// // //               {errors.company_mobile && <p className="text-xs text-red-500">{errors.company_mobile.message}</p>}
// // //             </div>

// // //             <div className="space-y-2">
// // //               <Label htmlFor="company_landline">Landline</Label>
// // //               <Input id="company_landline" placeholder="Optional" className="h-10" {...register("company_landline")} />
// // //             </div>

// // //             <div className="md:col-span-2 space-y-2">
// // //               <Label htmlFor="company_logo">Logo URL</Label>
// // //               <Input id="company_logo" placeholder="https://.../logo.png" className="h-10" {...register("company_logo")} />
// // //               <p className="text-xs text-slate-400">Used on letterhead. Public image URL.</p>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <div className="border-t border-slate-200 pt-8 space-y-5">
// // //           <div>
// // //             <h2 className="text-lg font-semibold text-slate-900">Address</h2>
// // //             <p className="text-sm text-slate-500 mt-0.5">Appears on official letters</p>
// // //           </div>

// // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// // //             <div className="md:col-span-2 space-y-2">
// // //               <Label htmlFor="company_address">Address</Label>
// // //               <Input id="company_address" placeholder="Plot / Building, Street" className="h-10" {...register("company_address")} />
// // //             </div>

// // //             <div className="space-y-2">
// // //               <Label htmlFor="company_city">City</Label>
// // //               <Input id="company_city" placeholder="Gurugram" className="h-10" {...register("company_city")} />
// // //             </div>

// // //             <div className="space-y-2">
// // //               <Label htmlFor="company_state">State</Label>
// // //               <Input id="company_state" placeholder="Haryana" className="h-10" {...register("company_state")} />
// // //             </div>

// // //             <div className="space-y-2">
// // //               <Label htmlFor="company_country">Country</Label>
// // //               <Input id="company_country" placeholder="India" className="h-10" {...register("company_country")} />
// // //             </div>

// // //             <div className="space-y-2">
// // //               <Label htmlFor="company_zipcode">PIN / Zip Code</Label>
// // //               <Input id="company_zipcode" placeholder="122015" className="h-10" {...register("company_zipcode")} />
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <div className="border-t border-slate-200 pt-6 flex items-center gap-3 justify-end">
// // //           <Button type="button" variant="outline" onClick={cancelEdit} disabled={saving}>
// // //             Cancel
// // //           </Button>
// // //           <Button type="submit" disabled={saving} className="gap-2">
// // //             {saving ? (
// // //               <>
// // //                 <Loader2 className="h-4 w-4 animate-spin" />
// // //                 Saving...
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <Save className="h-4 w-4" />
// // //                 Save Changes
// // //               </>
// // //             )}
// // //           </Button>
// // //         </div>
// // //       </form>
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useState, useEffect } from "react";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { z } from "zod";
// // import { toast } from "sonner";
// // import {
// //   Loader2,
// //   Save,
// //   X,
// //   Pencil,
// //   Eye,
// //   Building2,
// //   Mail,
// //   Phone,
// //   MapPin,
// // } from "lucide-react";
// // import { api } from "@/lib/api";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";

// // const companySchema = z.object({
// //   company_name: z.string().min(2, "Company name is required"),
// //   company_email: z.string().email("Valid email is required"),
// //   company_mobile: z.string().min(10, "Valid phone number is required"),
// //   company_address: z.string().optional(),
// //   company_city: z.string().optional(),
// //   company_state: z.string().optional(),
// //   company_country: z.string().optional(),
// //   company_zipcode: z.string().optional(),
// //   company_landline: z.string().optional(),
// //   company_logo: z.string().optional(),
// // });

// // function pickCompany(body) {
// //   if (!body) return null;
// //   if (Array.isArray(body.data) && body.data.length > 0) return body.data[0];
// //   if (body.data && body.data.company_id) return body.data;
// //   if (Array.isArray(body.check_existing) && body.check_existing.length > 0)
// //     return body.check_existing[0];
// //   if (body.company_id) return body;
// //   return null;
// // }

// // export default function CompanyConfigPage() {
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState("");
// //   const [companyId, setCompanyId] = useState("");
// //   const [mode, setMode] = useState("view");
// //   const [company, setCompany] = useState(null);

// //   const {
// //     register,
// //     handleSubmit,
// //     formState: { errors },
// //     reset,
// //   } = useForm({
// //     resolver: zodResolver(companySchema),
// //     mode: "onBlur",
// //     defaultValues: {
// //       company_name: "",
// //       company_email: "",
// //       company_mobile: "",
// //       company_address: "",
// //       company_city: "",
// //       company_state: "",
// //       company_country: "",
// //       company_zipcode: "",
// //       company_landline: "",
// //       company_logo: "",
// //     },
// //   });

// //   useEffect(() => {
// //     fetchCompanyDetails();
// //   }, []);

// //   const fetchCompanyDetails = async () => {
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const res = await api.get("/api/v1/get/company", {
// //         params: { page: 1, page_size: 1 },
// //       });

// //       const data = pickCompany(res?.data);

// //       if (!data || !data.company_id) {
// //         setError("Company details not found");
// //         setCompany(null);
// //         setLoading(false);
// //         return;
// //       }

// //       setCompanyId(data.company_id);
// //       setCompany(data);

// //       reset({
// //         company_name: data.company_name || "",
// //         company_email: data.company_email || "",
// //         company_mobile: data.company_mobile || "",
// //         company_address: data.company_address || "",
// //         company_city: data.company_city || "",
// //         company_state: data.company_state || "",
// //         company_country: data.company_country || "",
// //         company_zipcode: data.company_zipcode || "",
// //         company_landline: data.company_landline || "",
// //         company_logo: data.company_logo || "",
// //       });
// //     } catch (err) {
// //       const msg =
// //         err?.response?.data?.detail || "Failed to load company details";
// //       setError(typeof msg === "string" ? msg : "Failed to load company details");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const onSubmit = async (values) => {
// //     if (!companyId) {
// //       toast.error("Company ID not found");
// //       return;
// //     }

// //     setSaving(true);
// //     setError("");
// //     try {
// //       // CreateCompany schema requires first_name, last_name, password
// //       const payload = {
// //         company_name: values.company_name,
// //         company_email: values.company_email,
// //         company_mobile: values.company_mobile,
// //         company_address: values.company_address || null,
// //         company_city: values.company_city || null,
// //         company_state: values.company_state || null,
// //         company_country: values.company_country || null,
// //         company_zipcode: values.company_zipcode || null,
// //         company_landline: values.company_landline || null,
// //         company_logo: values.company_logo || null,
// //         first_name: "Admin",
// //         last_name: "User",
// //         password: "NoChange@12345",
// //         profile_pic: null,
// //       };

// //       const res = await api.put(
// //         `/api/v1/update/company/${companyId}`,
// //         payload
// //       );

// //       if (res.data?.success || res.status === 200) {
// //         toast.success("Company details updated successfully!");
// //         setMode("view");
// //         await fetchCompanyDetails();
// //       }
// //     } catch (err) {
// //       const errorMsg =
// //         err?.response?.data?.detail || "Failed to update company details";
// //       const msg =
// //         typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg);
// //       setError(msg);
// //       toast.error(msg);
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const startEdit = () => {
// //     setError("");
// //     setMode("edit");
// //   };

// //   const cancelEdit = () => {
// //     setError("");
// //     setMode("view");
// //     if (company) {
// //       reset({
// //         company_name: company.company_name || "",
// //         company_email: company.company_email || "",
// //         company_mobile: company.company_mobile || "",
// //         company_address: company.company_address || "",
// //         company_city: company.company_city || "",
// //         company_state: company.company_state || "",
// //         company_country: company.company_country || "",
// //         company_zipcode: company.company_zipcode || "",
// //         company_landline: company.company_landline || "",
// //         company_logo: company.company_logo || "",
// //       });
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-[60vh]">
// //         <div className="flex flex-col items-center gap-3">
// //           <Loader2 className="h-8 w-8 animate-spin text-primary" />
// //           <p className="text-slate-600 text-sm">Loading company details...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   /* ========== VIEW ========== */
// //   if (mode === "view") {
// //     return (
// //       <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
// //         <div className="flex items-center justify-between">
// //           <div>
// //             <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
// //             <p className="text-slate-600 mt-1 text-sm">
// //               View and manage your company details
// //             </p>
// //           </div>
// //           <Button onClick={startEdit} className="gap-2">
// //             <Pencil className="h-4 w-4" />
// //             Edit Details
// //           </Button>
// //         </div>

// //         {error && (
// //           <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
// //             <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
// //             <button
// //               type="button"
// //               onClick={() => setError("")}
// //               className="text-red-500"
// //             >
// //               <X className="h-4 w-4" />
// //             </button>
// //           </div>
// //         )}

// //         <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
// //           <div className="bg-[#0f172a] px-6 py-6 text-white">
// //             <div className="flex items-start gap-4">
// //               {company?.company_logo ? (
// //                 <img
// //                   src={company.company_logo}
// //                   alt="Logo"
// //                   className="h-14 w-14 rounded-lg bg-white object-contain p-1"
// //                 />
// //               ) : (
// //                 <div className="h-14 w-14 rounded-lg bg-white/10 flex items-center justify-center">
// //                   <Building2 className="h-7 w-7 text-white/80" />
// //                 </div>
// //               )}
// //               <div>
// //                 <h2 className="text-xl font-semibold">
// //                   {company?.company_name || "—"}
// //                 </h2>
// //                 <p className="text-slate-300 text-sm mt-0.5">
// //                   {company?.company_email || "—"}
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="p-6 grid gap-6 md:grid-cols-2">
// //             <div className="space-y-4">
// //               <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
// //                 Contact
// //               </h3>
// //               <div className="flex items-start gap-3">
// //                 <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
// //                 <div>
// //                   <p className="text-xs text-slate-500">Email</p>
// //                   <p className="text-sm font-medium text-slate-900">
// //                     {company?.company_email || "—"}
// //                   </p>
// //                 </div>
// //               </div>
// //               <div className="flex items-start gap-3">
// //                 <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
// //                 <div>
// //                   <p className="text-xs text-slate-500">Mobile</p>
// //                   <p className="text-sm font-medium text-slate-900">
// //                     {company?.company_mobile || "—"}
// //                   </p>
// //                 </div>
// //               </div>
// //               <div className="flex items-start gap-3">
// //                 <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
// //                 <div>
// //                   <p className="text-xs text-slate-500">Landline</p>
// //                   <p className="text-sm font-medium text-slate-900">
// //                     {company?.company_landline || "—"}
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="space-y-4">
// //               <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
// //                 Address
// //               </h3>
// //               <div className="flex items-start gap-3">
// //                 <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
// //                 <div className="space-y-1">
// //                   <p className="text-xs text-slate-500">Full Address</p>
// //                   <p className="text-sm font-medium text-slate-900">
// //                     {company?.company_address || "—"}
// //                   </p>
// //                   <p className="text-sm text-slate-700">
// //                     {[company?.company_city, company?.company_state]
// //                       .filter(Boolean)
// //                       .join(", ") || "—"}
// //                   </p>
// //                   <p className="text-sm text-slate-700">
// //                     {[company?.company_country, company?.company_zipcode]
// //                       .filter(Boolean)
// //                       .join(" - ") || "—"}
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex justify-end">
// //             <Button onClick={startEdit} variant="outline" className="gap-2">
// //               <Pencil className="h-4 w-4" />
// //               Edit Details
// //             </Button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   /* ========== EDIT ========== */
// //   return (
// //     <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h1 className="text-2xl font-bold text-slate-900">
// //             Edit Company Details
// //           </h1>
// //           <p className="text-slate-600 mt-1 text-sm">
// //             Update information used on letters and documents
// //           </p>
// //         </div>
// //         <Button
// //           type="button"
// //           variant="outline"
// //           onClick={cancelEdit}
// //           className="gap-2"
// //         >
// //           <Eye className="h-4 w-4" />
// //           View Details
// //         </Button>
// //       </div>

// //       {error && (
// //         <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
// //           <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
// //           <button
// //             type="button"
// //             onClick={() => setError("")}
// //             className="text-red-500"
// //           >
// //             <X className="h-4 w-4" />
// //           </button>
// //         </div>
// //       )}

// //       <form
// //         onSubmit={handleSubmit(onSubmit)}
// //         className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 md:p-8 space-y-8"
// //       >
// //         <div className="space-y-5">
// //           <div>
// //             <h2 className="text-lg font-semibold text-slate-900">
// //               Basic Information
// //             </h2>
// //             <p className="text-sm text-slate-500 mt-0.5">Core company details</p>
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// //             <div className="space-y-2">
// //               <Label htmlFor="company_name">Company Name *</Label>
// //               <Input
// //                 id="company_name"
// //                 placeholder="Your Company Name"
// //                 className="h-10"
// //                 {...register("company_name")}
// //               />
// //               {errors.company_name && (
// //                 <p className="text-xs text-red-500">
// //                   {errors.company_name.message}
// //                 </p>
// //               )}
// //             </div>

// //             <div className="space-y-2">
// //               <Label htmlFor="company_email">Email Address *</Label>
// //               <Input
// //                 id="company_email"
// //                 type="email"
// //                 placeholder="company@example.com"
// //                 className="h-10"
// //                 {...register("company_email")}
// //               />
// //               {errors.company_email && (
// //                 <p className="text-xs text-red-500">
// //                   {errors.company_email.message}
// //                 </p>
// //               )}
// //             </div>

// //             <div className="space-y-2">
// //               <Label htmlFor="company_mobile">Mobile *</Label>
// //               <Input
// //                 id="company_mobile"
// //                 placeholder="+91 98765 43210"
// //                 className="h-10"
// //                 {...register("company_mobile")}
// //               />
// //               {errors.company_mobile && (
// //                 <p className="text-xs text-red-500">
// //                   {errors.company_mobile.message}
// //                 </p>
// //               )}
// //             </div>

// //             <div className="space-y-2">
// //               <Label htmlFor="company_landline">Landline</Label>
// //               <Input
// //                 id="company_landline"
// //                 placeholder="Optional"
// //                 className="h-10"
// //                 {...register("company_landline")}
// //               />
// //             </div>

// //             <div className="md:col-span-2 space-y-2">
// //               <Label htmlFor="company_logo">Logo URL</Label>
// //               <Input
// //                 id="company_logo"
// //                 placeholder="https://.../logo.png"
// //                 className="h-10"
// //                 {...register("company_logo")}
// //               />
// //               <p className="text-xs text-slate-400">
// //                 Used on letterhead. Public image URL.
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="border-t border-slate-200 pt-8 space-y-5">
// //           <div>
// //             <h2 className="text-lg font-semibold text-slate-900">Address</h2>
// //             <p className="text-sm text-slate-500 mt-0.5">
// //               Appears on official letters
// //             </p>
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// //             <div className="md:col-span-2 space-y-2">
// //               <Label htmlFor="company_address">Address</Label>
// //               <Input
// //                 id="company_address"
// //                 placeholder="Plot / Building, Street"
// //                 className="h-10"
// //                 {...register("company_address")}
// //               />
// //             </div>

// //             <div className="space-y-2">
// //               <Label htmlFor="company_city">City</Label>
// //               <Input
// //                 id="company_city"
// //                 placeholder="Gurugram"
// //                 className="h-10"
// //                 {...register("company_city")}
// //               />
// //             </div>

// //             <div className="space-y-2">
// //               <Label htmlFor="company_state">State</Label>
// //               <Input
// //                 id="company_state"
// //                 placeholder="Haryana"
// //                 className="h-10"
// //                 {...register("company_state")}
// //               />
// //             </div>

// //             <div className="space-y-2">
// //               <Label htmlFor="company_country">Country</Label>
// //               <Input
// //                 id="company_country"
// //                 placeholder="India"
// //                 className="h-10"
// //                 {...register("company_country")}
// //               />
// //             </div>

// //             <div className="space-y-2">
// //               <Label htmlFor="company_zipcode">PIN / Zip Code</Label>
// //               <Input
// //                 id="company_zipcode"
// //                 placeholder="122015"
// //                 className="h-10"
// //                 {...register("company_zipcode")}
// //               />
// //             </div>
// //           </div>
// //         </div>

// //         <div className="border-t border-slate-200 pt-6 flex items-center gap-3 justify-end">
// //           <Button
// //             type="button"
// //             variant="outline"
// //             onClick={cancelEdit}
// //             disabled={saving}
// //           >
// //             Cancel
// //           </Button>
// //           <Button type="submit" disabled={saving} className="gap-2">
// //             {saving ? (
// //               <>
// //                 <Loader2 className="h-4 w-4 animate-spin" />
// //                 Saving...
// //               </>
// //             ) : (
// //               <>
// //                 <Save className="h-4 w-4" />
// //                 Save Changes
// //               </>
// //             )}
// //           </Button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // }

// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { toast } from "sonner";
// import {
//   Loader2,
//   Save,
//   X,
//   Pencil,
//   Eye,
//   Building2,
//   Mail,
//   Phone,
//   MapPin,
//   Users,
//   Briefcase,
//   MapPinned,
//   Calendar,
//   Globe2,
//   Wallet,
//   Clock,
//   CheckCircle2,
//   ShieldCheck,
//   BadgeCheck,
//   Sparkles,
//   Copy,
//   Check,
//   ChevronRight,
//   TrendingUp,
//   FileText,
//   Settings2,
//   Palette,
//   Bell,
//   Building,
//   UserCircle2,
// } from "lucide-react";
// import { api } from "@/lib/api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// /* ═══════════════════════════════════════════════════════
//    SCHEMA
//    ═══════════════════════════════════════════════════════ */

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

// /* ═══════════════════════════════════════════════════════
//    HELPERS
//    ═══════════════════════════════════════════════════════ */

// function pickCompany(body) {
//   if (!body) return null;
//   if (Array.isArray(body.data) && body.data.length > 0) return body.data[0];
//   if (body.data && body.data.company_id) return body.data;
//   if (Array.isArray(body.check_existing) && body.check_existing.length > 0)
//     return body.check_existing[0];
//   if (body.company_id) return body;
//   return null;
// }

// function formatDate(d) {
//   if (!d) return "—";
//   try {
//     return new Date(d).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   } catch {
//     return String(d);
//   }
// }

// function initialsOf(name) {
//   return String(name || "")
//     .split(" ")
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((w) => w[0])
//     .join("")
//     .toUpperCase();
// }

// /* ═══════════════════════════════════════════════════════
//    MAIN COMPONENT
//    ═══════════════════════════════════════════════════════ */

// export default function CompanyProfilePage() {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [companyId, setCompanyId] = useState("");
//   const [mode, setMode] = useState("view"); // view | edit
//   const [company, setCompany] = useState(null);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [copied, setCopied] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isDirty },
//     reset,
//     watch,
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

//   const watchedLogo = watch("company_logo");

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

//       const data = pickCompany(res?.data);

//       if (!data || !data.company_id) {
//         setError("Company details not found");
//         setCompany(null);
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
//       const msg =
//         err?.response?.data?.detail || "Failed to load company details";
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

//       const res = await api.put(
//         `/api/v1/update/company/${companyId}`,
//         payload
//       );

//       if (res.data?.success || res.status === 200) {
//         toast.success("Company details updated successfully!");
//         setMode("view");
//         await fetchCompanyDetails();
//       }
//     } catch (err) {
//       const errorMsg =
//         err?.response?.data?.detail || "Failed to update company details";
//       const msg =
//         typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg);
//       setError(msg);
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const startEdit = () => {
//     setError("");
//     setMode("edit");
//     setActiveTab("overview");
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

//   /* ---------- Address formatter ---------- */
//   const formattedAddress = useMemo(() => {
//     if (!company) return "—";
//     const parts = [
//       company.company_address,
//       company.company_city,
//       company.company_state,
//       company.company_country,
//       company.company_zipcode,
//     ].filter(Boolean);
//     return parts.length > 0 ? parts.join(", ") : "—";
//   }, [company]);

//   const copyCompanyId = () => {
//     if (!companyId) return;
//     navigator.clipboard.writeText(companyId);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   /* ---------- Loading ---------- */
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh] bg-slate-50">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="h-8 w-8 animate-spin text-[#E42527]" />
//           <p className="text-slate-600 text-sm">Loading company details…</p>
//         </div>
//       </div>
//     );
//   }

//   /* ═══════════════════════════════════════════════════════
//      VIEW MODE
//      ═══════════════════════════════════════════════════════ */
//   if (mode === "view") {
//     return (
//       <div className="min-h-screen bg-slate-50 pb-12">
//         {/* ─── HERO HEADER ─── */}
//         <div className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
//           {/* Decorative background */}
//           <div className="absolute inset-0 opacity-20">
//             <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E42527] blur-3xl" />
//             <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-blue-500 blur-3xl" />
//           </div>

//           <div className="relative mx-auto max-w-7xl px-6 py-8">
//             <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
//               <div className="flex items-center gap-5">
//                 {/* Logo */}
//                 <div className="shrink-0">
//                   {company?.company_logo ? (
//                     <img
//                       src={company.company_logo}
//                       alt="Logo"
//                       className="h-20 w-20 rounded-2xl bg-white object-contain p-2 shadow-2xl ring-2 ring-white/20"
//                     />
//                   ) : (
//                     <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 to-white/5 text-2xl font-bold shadow-2xl ring-2 ring-white/20 backdrop-blur">
//                       {initialsOf(company?.company_name) || (
//                         <Building2 className="h-9 w-9 text-white/80" />
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Name + badges */}
//                 <div>
//                   <div className="flex flex-wrap items-center gap-2">
//                     <h1 className="text-2xl font-bold tracking-tight">
//                       {company?.company_name || "—"}
//                     </h1>
//                     {company?.email_verified && (
//                       <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
//                         <BadgeCheck className="h-3.5 w-3.5" />
//                         Verified
//                       </span>
//                     )}
//                     <span
//                       className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
//                         company?.active_status !== false
//                           ? "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30"
//                           : "bg-slate-500/20 text-slate-300 ring-slate-500/30"
//                       }`}
//                     >
//                       <span
//                         className={`h-1.5 w-1.5 rounded-full ${
//                           company?.active_status !== false
//                             ? "bg-emerald-400"
//                             : "bg-slate-400"
//                         }`}
//                       />
//                       {company?.active_status !== false ? "Active" : "Inactive"}
//                     </span>
//                   </div>

//                   <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-300">
//                     <span className="inline-flex items-center gap-1.5">
//                       <Mail className="h-3.5 w-3.5" />
//                       {company?.company_email || "—"}
//                     </span>
//                     <span className="inline-flex items-center gap-1.5">
//                       <Phone className="h-3.5 w-3.5" />
//                       {company?.company_mobile || "—"}
//                     </span>
//                     {company?.company_landline && (
//                       <span className="inline-flex items-center gap-1.5">
//                         <Phone className="h-3.5 w-3.5" />
//                         {company.company_landline}
//                       </span>
//                     )}
//                   </div>

//                   {/* Company ID chip */}
//                   <button
//                     type="button"
//                     onClick={copyCompanyId}
//                     className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-mono text-slate-200 ring-1 ring-white/20 transition hover:bg-white/20"
//                   >
//                     <span className="text-slate-400">ID:</span>
//                     {companyId || "—"}
//                     {copied ? (
//                       <Check className="h-3 w-3 text-emerald-400" />
//                     ) : (
//                       <Copy className="h-3 w-3 text-slate-400" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <Button
//                 onClick={startEdit}
//                 className="gap-2 bg-white text-slate-900 shadow-lg hover:bg-slate-100"
//               >
//                 <Pencil className="h-4 w-4" />
//                 Edit Company
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* ─── CONTENT ─── */}
//         <div className="mx-auto max-w-7xl px-6 -mt-8 relative z-10">
//           {error && (
//             <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
//               <p className="flex-1 text-sm font-medium text-red-800">{error}</p>
//               <button
//                 type="button"
//                 onClick={() => setError("")}
//                 className="text-red-500 hover:text-red-700"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//           )}

//           {/* ─── STATS STRIP ─── */}
//           <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
//             <StatCard
//               icon={<Users className="h-4 w-4" />}
//               label="Total Employees"
//               value={company?.total_employees ?? "—"}
//               tone="blue"
//             />
//             <StatCard
//               icon={<Briefcase className="h-4 w-4" />}
//               label="Departments"
//               value={company?.total_departments ?? "—"}
//               tone="violet"
//             />
//             <StatCard
//               icon={<MapPinned className="h-4 w-4" />}
//               label="Locations"
//               value={company?.total_locations ?? "—"}
//               tone="emerald"
//             />
//             <StatCard
//               icon={<Calendar className="h-4 w-4" />}
//               label="Established"
//               value={formatDate(company?.company_established_date)}
//               tone="amber"
//             />
//           </div>

//           {/* ─── TABS ─── */}
//           <div className="mt-8 border-b border-slate-200">
//             <div className="flex flex-wrap gap-1">
//               {[
//                 { id: "overview", label: "Overview", icon: <Building className="h-4 w-4" /> },
//                 { id: "contact", label: "Contact", icon: <Phone className="h-4 w-4" /> },
//                 { id: "address", label: "Address", icon: <MapPin className="h-4 w-4" /> },
//                 { id: "preferences", label: "Preferences", icon: <Settings2 className="h-4 w-4" /> },
//               ].map((tab) => (
//                 <button
//                   key={tab.id}
//                   type="button"
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`relative inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition ${
//                     activeTab === tab.id
//                       ? "text-[#E42527]"
//                       : "text-slate-500 hover:text-slate-800"
//                   }`}
//                 >
//                   {tab.icon}
//                   {tab.label}
//                   {activeTab === tab.id && (
//                     <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#E42527]" />
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* ─── TAB CONTENT ─── */}
//           <div className="mt-6">
//             {activeTab === "overview" && (
//               <OverviewTab company={company} formattedAddress={formattedAddress} />
//             )}
//             {activeTab === "contact" && <ContactTab company={company} />}
//             {activeTab === "address" && <AddressTab company={company} />}
//             {activeTab === "preferences" && <PreferencesTab company={company} />}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* ═══════════════════════════════════════════════════════
//      EDIT MODE
//      ═══════════════════════════════════════════════════════ */
//   return (
//     <div className="min-h-screen bg-slate-50 pb-24">
//       {/* Header */}
//       <div className="border-b border-slate-200 bg-white">
//         <div className="mx-auto max-w-7xl px-6 py-6">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div className="flex items-center gap-4">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E42527] to-[#c91f21] text-white shadow-lg shadow-red-200">
//                 <Pencil className="h-6 w-6" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-slate-900">
//                   Edit Company
//                 </h1>
//                 <p className="text-sm text-slate-500">
//                   Update information used on letters and documents
//                 </p>
//               </div>
//             </div>

//             <Button
//               type="button"
//               variant="outline"
//               onClick={cancelEdit}
//               className="gap-2"
//             >
//               <Eye className="h-4 w-4" />
//               Preview
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Error banner */}
//       <div className="mx-auto max-w-5xl px-6 mt-6">
//         {error && (
//           <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
//             <p className="flex-1 text-sm font-medium text-red-800">{error}</p>
//             <button
//               type="button"
//               onClick={() => setError("")}
//               className="text-red-500 hover:text-red-700"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Form */}
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="mx-auto max-w-5xl px-6 py-6 space-y-6"
//       >
//         {/* ─── Basic Information ─── */}
//         <FormSection
//           icon={<Building2 className="h-5 w-5" />}
//           title="Basic Information"
//           subtitle="Core company details"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div className="md:col-span-2 space-y-2">
//               <Label htmlFor="company_name">Company Name *</Label>
//               <Input
//                 id="company_name"
//                 placeholder="Your Company Name"
//                 className="h-11"
//                 {...register("company_name")}
//               />
//               {errors.company_name && (
//                 <p className="text-xs text-red-500">
//                   {errors.company_name.message}
//                 </p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="company_email">Email Address *</Label>
//               <Input
//                 id="company_email"
//                 type="email"
//                 placeholder="company@example.com"
//                 className="h-11"
//                 {...register("company_email")}
//               />
//               {errors.company_email && (
//                 <p className="text-xs text-red-500">
//                   {errors.company_email.message}
//                 </p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="company_mobile">Mobile *</Label>
//               <Input
//                 id="company_mobile"
//                 placeholder="+91 98765 43210"
//                 className="h-11"
//                 {...register("company_mobile")}
//               />
//               {errors.company_mobile && (
//                 <p className="text-xs text-red-500">
//                   {errors.company_mobile.message}
//                 </p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="company_landline">Landline</Label>
//               <Input
//                 id="company_landline"
//                 placeholder="Optional"
//                 className="h-11"
//                 {...register("company_landline")}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="company_established_date">
//                 Established Date
//               </Label>
//               <Input
//                 id="company_established_date"
//                 type="date"
//                 className="h-11"
//                 defaultValue={
//                   company?.company_established_date
//                     ? String(company.company_established_date).slice(0, 10)
//                     : ""
//                 }
//                 disabled
//               />
//               <p className="text-xs text-slate-400">
//                 Contact admin to change
//               </p>
//             </div>
//           </div>
//         </FormSection>

//         {/* ─── Logo / Branding ─── */}
//         <FormSection
//           icon={<Palette className="h-5 w-5" />}
//           title="Branding"
//           subtitle="Logo shown on letterheads and payslips"
//         >
//           <div className="grid grid-cols-1 gap-5 lg:grid-cols-[200px_1fr]">
//             <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
//               {watchedLogo ? (
//                 <img
//                   src={watchedLogo}
//                   alt="Logo Preview"
//                   className="h-24 w-24 rounded-xl bg-white object-contain p-2 shadow-sm ring-1 ring-slate-200"
//                   onError={(e) => {
//                     e.currentTarget.style.display = "none";
//                   }}
//                 />
//               ) : (
//                 <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-white text-3xl font-bold text-slate-300 shadow-sm ring-1 ring-slate-200">
//                   {initialsOf(watch("company_name")) || (
//                     <Building2 className="h-10 w-10 text-slate-300" />
//                   )}
//                 </div>
//               )}
//               <p className="mt-3 text-xs text-slate-500">Preview</p>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="company_logo">Logo URL</Label>
//               <Input
//                 id="company_logo"
//                 placeholder="https://cdn.company.com/logo.png"
//                 className="h-11"
//                 {...register("company_logo")}
//               />
//               <p className="text-xs text-slate-400">
//                 Public image URL (PNG/JPG/SVG). Recommended: 200×200, transparent background.
//               </p>
//             </div>
//           </div>
//         </FormSection>

//         {/* ─── Address ─── */}
//         <FormSection
//           icon={<MapPin className="h-5 w-5" />}
//           title="Address"
//           subtitle="Appears on official letters and invoices"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div className="md:col-span-2 space-y-2">
//               <Label htmlFor="company_address">Street Address</Label>
//               <Input
//                 id="company_address"
//                 placeholder="Plot / Building, Street"
//                 className="h-11"
//                 {...register("company_address")}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="company_city">City</Label>
//               <Input
//                 id="company_city"
//                 placeholder="Gurugram"
//                 className="h-11"
//                 {...register("company_city")}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="company_state">State</Label>
//               <Input
//                 id="company_state"
//                 placeholder="Haryana"
//                 className="h-11"
//                 {...register("company_state")}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="company_country">Country</Label>
//               <Input
//                 id="company_country"
//                 placeholder="India"
//                 className="h-11"
//                 {...register("company_country")}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="company_zipcode">PIN / Zip Code</Label>
//               <Input
//                 id="company_zipcode"
//                 placeholder="122015"
//                 className="h-11"
//                 {...register("company_zipcode")}
//               />
//             </div>
//           </div>
//         </FormSection>
//       </form>

//       {/* ─── STICKY SAVE BAR ─── */}
//       <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-sm">
//         <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
//           <div className="text-sm">
//             {isDirty ? (
//               <span className="inline-flex items-center gap-1.5 text-amber-600">
//                 <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
//                 Unsaved changes
//               </span>
//             ) : (
//               <span className="text-slate-400">No changes yet</span>
//             )}
//           </div>
//           <div className="flex items-center gap-3">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={cancelEdit}
//               disabled={saving}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSubmit(onSubmit)}
//               disabled={saving}
//               className="gap-2 bg-[#E42527] hover:bg-[#c91f21]"
//             >
//               {saving ? (
//                 <>
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                   Saving…
//                 </>
//               ) : (
//                 <>
//                   <Save className="h-4 w-4" />
//                   Save Changes
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════
//    SUB-COMPONENTS
//    ═══════════════════════════════════════════════════════ */

// const TONE = {
//   blue: "from-blue-50 to-blue-100/50 border-blue-200 text-blue-700",
//   violet: "from-violet-50 to-violet-100/50 border-violet-200 text-violet-700",
//   emerald: "from-emerald-50 to-emerald-100/50 border-emerald-200 text-emerald-700",
//   amber: "from-amber-50 to-amber-100/50 border-amber-200 text-amber-700",
// };

// function StatCard({ icon, label, value, tone = "blue" }) {
//   return (
//     <div
//       className={`rounded-2xl border bg-gradient-to-br p-4 shadow-sm ${TONE[tone]}`}
//     >
//       <div className="flex items-center gap-2 opacity-70">
//         {icon}
//         <p className="text-[11px] font-semibold uppercase tracking-wide">
//           {label}
//         </p>
//       </div>
//       <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
//     </div>
//   );
// }

// function FormSection({ icon, title, subtitle, children }) {
//   return (
//     <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//       <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
//         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
//           {icon}
//         </div>
//         <div>
//           <h2 className="text-sm font-bold text-slate-900">{title}</h2>
//           {subtitle && (
//             <p className="text-xs text-slate-500">{subtitle}</p>
//           )}
//         </div>
//       </div>
//       <div className="p-6">{children}</div>
//     </div>
//   );
// }

// function InfoTile({ icon, label, value, mono, verified }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2 text-slate-400">
//           {icon}
//           <span className="text-[11px] font-semibold uppercase tracking-wide">
//             {label}
//           </span>
//         </div>
//         {verified && (
//           <CheckCircle2 className="h-4 w-4 text-emerald-500" />
//         )}
//       </div>
//       <p
//         className={`mt-2 text-sm font-medium text-slate-900 ${
//           mono ? "font-mono" : ""
//         }`}
//       >
//         {value || "—"}
//       </p>
//     </div>
//   );
// }

// function OverviewTab({ company, formattedAddress }) {
//   return (
//     <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//       {/* Left column — Company details */}
//       <div className="lg:col-span-2 space-y-6">
//         <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="mb-5 flex items-center gap-2">
//             <Building2 className="h-5 w-5 text-[#E42527]" />
//             <h3 className="text-sm font-bold text-slate-900">
//               Company Information
//             </h3>
//           </div>

//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//             <InfoTile
//               icon={<Building2 className="h-3.5 w-3.5" />}
//               label="Company Name"
//               value={company?.company_name}
//             />
//             <InfoTile
//               icon={<BadgeCheck className="h-3.5 w-3.5" />}
//               label="Company ID"
//               value={company?.company_id}
//               mono
//             />
//             <InfoTile
//               icon={<Mail className="h-3.5 w-3.5" />}
//               label="Primary Email"
//               value={company?.company_email}
//               verified={company?.email_verified}
//             />
//             <InfoTile
//               icon={<Phone className="h-3.5 w-3.5" />}
//               label="Mobile"
//               value={company?.company_mobile}
//               verified={company?.mobile_verified}
//             />
//             <InfoTile
//               icon={<Phone className="h-3.5 w-3.5" />}
//               label="Landline"
//               value={company?.company_landline}
//             />
//             <InfoTile
//               icon={<Calendar className="h-3.5 w-3.5" />}
//               label="Established"
//               value={formatDate(company?.company_established_date)}
//             />
//           </div>
//         </div>

//         {/* Address card */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="mb-5 flex items-center gap-2">
//             <MapPin className="h-5 w-5 text-[#E42527]" />
//             <h3 className="text-sm font-bold text-slate-900">
//               Registered Address
//             </h3>
//           </div>

//           <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/60 p-5 ring-1 ring-slate-100">
//             <div className="flex items-start gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
//                 <MapPin className="h-5 w-5" />
//               </div>
//               <div className="flex-1 text-sm leading-6 text-slate-700">
//                 <p className="font-medium text-slate-900">
//                   {company?.company_name}
//                 </p>
//                 {company?.company_address && <p>{company.company_address}</p>}
//                 <p>
//                   {[company?.company_city, company?.company_state]
//                     .filter(Boolean)
//                     .join(", ") || "—"}
//                 </p>
//                 <p>
//                   {[company?.company_country, company?.company_zipcode]
//                     .filter(Boolean)
//                     .join(" - ") || "—"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right column — Meta */}
//       <div className="space-y-6">
//         {/* Verification status */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="mb-4 flex items-center gap-2">
//             <ShieldCheck className="h-5 w-5 text-[#E42527]" />
//             <h3 className="text-sm font-bold text-slate-900">
//               Verification
//             </h3>
//           </div>

//           <div className="space-y-3">
//             <VerifyRow
//               label="Email Verified"
//               value={company?.email_verified}
//             />
//             <VerifyRow
//               label="Mobile Verified"
//               value={company?.mobile_verified}
//             />
//             <VerifyRow
//               label="Account Status"
//               value={company?.active_status !== false}
//               textValue={
//                 company?.active_status !== false ? "Active" : "Inactive"
//               }
//             />
//           </div>
//         </div>

//         {/* Company metadata */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="mb-4 flex items-center gap-2">
//             <Sparkles className="h-5 w-5 text-[#E42527]" />
//             <h3 className="text-sm font-bold text-slate-900">
//               Metadata
//             </h3>
//           </div>

//           <div className="space-y-3 text-sm">
//             <MetaRow label="Created" value={formatDate(company?.created_at)} />
//             <MetaRow label="Last Updated" value={formatDate(company?.updated_at)} />
//             <MetaRow
//               label="Timezone"
//               value={company?.timezone || "Asia/Kolkata"}
//             />
//             <MetaRow
//               label="Currency"
//               value={company?.currency || "INR"}
//             />
//           </div>
//         </div>

//         {/* Quick tips */}
//         <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-amber-100/40 p-5 shadow-sm">
//           <div className="flex items-start gap-3">
//             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
//               <Sparkles className="h-4 w-4" />
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-amber-900">
//                 Pro tip
//               </p>
//               <p className="mt-1 text-xs leading-5 text-amber-800">
//                 Keep your address and logo updated — they appear on all
//                 generated letters, payslips, and offer letters.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ContactTab({ company }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//       <div className="mb-5 flex items-center gap-2">
//         <Phone className="h-5 w-5 text-[#E42527]" />
//         <h3 className="text-sm font-bold text-slate-900">
//           Contact Information
//         </h3>
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         <ContactCard
//           icon={<Mail className="h-5 w-5" />}
//           label="Primary Email"
//           value={company?.company_email}
//           verified={company?.email_verified}
//           tone="blue"
//         />
//         <ContactCard
//           icon={<Phone className="h-5 w-5" />}
//           label="Mobile Number"
//           value={company?.company_mobile}
//           verified={company?.mobile_verified}
//           tone="emerald"
//         />
//         <ContactCard
//           icon={<Phone className="h-5 w-5" />}
//           label="Landline"
//           value={company?.company_landline || "Not provided"}
//           tone="slate"
//         />
//       </div>
//     </div>
//   );
// }

// function ContactCard({ icon, label, value, verified, tone = "blue" }) {
//   const bg = {
//     blue: "bg-blue-50 text-blue-600",
//     emerald: "bg-emerald-50 text-emerald-600",
//     slate: "bg-slate-100 text-slate-500",
//   };
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5">
//       <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${bg[tone]}`}>
//         {icon}
//       </div>
//       <div className="mt-4 flex items-center gap-2">
//         <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
//           {label}
//         </p>
//         {verified && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
//       </div>
//       <p className="mt-1 text-sm font-medium text-slate-900 break-words">
//         {value || "—"}
//       </p>
//     </div>
//   );
// }

// function AddressTab({ company }) {
//   return (
//     <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//       <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//         <div className="mb-5 flex items-center gap-2">
//           <MapPin className="h-5 w-5 text-[#E42527]" />
//           <h3 className="text-sm font-bold text-slate-900">
//             Full Address
//           </h3>
//         </div>

//         <div className="space-y-4">
//           <AddressRow label="Street" value={company?.company_address} />
//           <AddressRow label="City" value={company?.company_city} />
//           <AddressRow label="State" value={company?.company_state} />
//           <AddressRow label="Country" value={company?.company_country} />
//           <AddressRow label="PIN / Zip" value={company?.company_zipcode} mono />
//         </div>
//       </div>

//       <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//         <div className="mb-5 flex items-center gap-2">
//           <MapPin className="h-5 w-5 text-[#E42527]" />
//           <h3 className="text-sm font-bold text-slate-900">
//             Formatted Address
//           </h3>
//           <p className="text-xs text-slate-400">Used on letters</p>
//         </div>

//         <div className="rounded-xl bg-slate-900 p-5 text-white">
//           <p className="text-sm font-semibold">{company?.company_name}</p>
//           <div className="mt-2 space-y-0.5 text-sm text-slate-300">
//             {company?.company_address && <p>{company.company_address}</p>}
//             <p>
//               {[company?.company_city, company?.company_state]
//                 .filter(Boolean)
//                 .join(", ") || "—"}
//             </p>
//             <p>
//               {[company?.company_country, company?.company_zipcode]
//                 .filter(Boolean)
//                 .join(" - ") || "—"}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function AddressRow({ label, value, mono }) {
//   return (
//     <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
//       <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
//         {label}
//       </span>
//       <span
//         className={`text-sm font-medium text-slate-900 ${
//           mono ? "font-mono" : ""
//         }`}
//       >
//         {value || "—"}
//       </span>
//     </div>
//   );
// }

// function PreferencesTab({ company }) {
//   return (
//     <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//       <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//         <div className="mb-5 flex items-center gap-2">
//           <Globe2 className="h-5 w-5 text-[#E42527]" />
//           <h3 className="text-sm font-bold text-slate-900">
//             Regional Settings
//           </h3>
//         </div>

//         <div className="space-y-4">
//           <PreferenceRow
//             icon={<Globe2 className="h-4 w-4" />}
//             label="Timezone"
//             value={company?.timezone || "Asia/Kolkata"}
//           />
//           <PreferenceRow
//             icon={<MapPin className="h-4 w-4" />}
//             label="Country"
//             value={company?.country || "IN"}
//           />
//           <PreferenceRow
//             icon={<Wallet className="h-4 w-4" />}
//             label="Currency"
//             value={company?.currency || "INR"}
//           />
//           <PreferenceRow
//             icon={<Calendar className="h-4 w-4" />}
//             label="Date Format"
//             value={company?.date_format || "DD/MM/YYYY"}
//           />
//           <PreferenceRow
//             icon={<Clock className="h-4 w-4" />}
//             label="Time Format"
//             value={company?.time_format || "12h"}
//           />
//         </div>
//       </div>

//       <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//         <div className="mb-5 flex items-center gap-2">
//           <Settings2 className="h-5 w-5 text-[#E42527]" />
//           <h3 className="text-sm font-bold text-slate-900">
//             Business Settings
//           </h3>
//         </div>

//         <div className="space-y-4">
//           <PreferenceRow
//             icon={<TrendingUp className="h-4 w-4" />}
//             label="Fiscal Year Start"
//             value={`Month ${company?.fiscal_year_start || 4}`}
//           />
//           <PreferenceRow
//             icon={<Calendar className="h-4 w-4" />}
//             label="Week Start"
//             value={company?.week_start === 0 ? "Monday" : "Sunday"}
//           />
//           <PreferenceRow
//             icon={<FileText className="h-4 w-4" />}
//             label="Employee Code Prefix"
//             value={company?.employee_code_prefix || "—"}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// function PreferenceRow({ icon, label, value }) {
//   return (
//     <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
//       <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-100">
//         {icon}
//       </div>
//       <div className="flex-1">
//         <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
//           {label}
//         </p>
//         <p className="text-sm font-medium text-slate-900">{value || "—"}</p>
//       </div>
//     </div>
//   );
// }

// function VerifyRow({ label, value, textValue }) {
//   return (
//     <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
//       <span className="text-xs font-medium text-slate-600">{label}</span>
//       {value ? (
//         <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
//           <CheckCircle2 className="h-3.5 w-3.5" />
//           {textValue || "Verified"}
//         </span>
//       ) : (
//         <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
//           <X className="h-3.5 w-3.5" />
//           {textValue || "Not verified"}
//         </span>
//       )}
//     </div>
//   );
// }

// function MetaRow({ label, value }) {
//   return (
//     <div className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0">
//       <span className="text-xs text-slate-500">{label}</span>
//       <span className="text-xs font-medium text-slate-700">{value}</span>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2, Save, X, Pencil, Eye, Building2, Mail, Phone, MapPin,
  Users, Briefcase, MapPinned, Calendar, Globe2, Wallet, Clock,
  CheckCircle2, ShieldCheck, BadgeCheck, Sparkles, Copy, Check,
  TrendingUp, FileText, Settings2, Palette, Building, RefreshCw,
  AlertTriangle, ChevronRight, Hash, Activity, Key, Award,
  Briefcase as BriefcaseIcon, Layers, CircleDot, Info,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ═══════════════════════════════════════════════════════
   SCHEMA
   ═══════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */

function pickCompany(body) {
  if (!body) return null;
  if (Array.isArray(body.check_existing) && body.check_existing.length > 0)
    return body.check_existing[0];
  if (Array.isArray(body.data) && body.data.length > 0) return body.data[0];
  if (body.data && body.data.company_id) return body.data;
  if (body.company_id) return body;
  return null;
}

function formatDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(d);
  }
}

function initialsOf(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [mode, setMode] = useState("view");
  const [company, setCompany] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState("");

  const [stats, setStats] = useState({
    employees: null,
    departments: null,
    locations: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
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

  const watchedLogo = watch("company_logo");

  /* ─────────────── FETCHERS ─────────────── */

  const fetchCompany = useCallback(async () => {
    const res = await api.get("/api/v1/get/company", {
      params: { page: 1, page_size: 1 },
    });
    const data = pickCompany(res?.data);
    if (!data || !data.company_id) throw new Error("Company details not found");
    return data;
  }, []);

  const fetchStats = useCallback(async () => {
    const [deptRes, locRes, empRes] = await Promise.allSettled([
      api.get("/api/v1/get/departments"),
      api.get("/api/v1/get/location/master"),
      api.get("/api/v1/get/employees"),
    ]);

    return {
      departments:
        deptRes.status === "fulfilled"
          ? deptRes.value?.data?.total_departments ?? 0
          : null,
      locations:
        locRes.status === "fulfilled"
          ? locRes.value?.data?.total_locations ?? 0
          : null,
      employees:
        empRes.status === "fulfilled"
          ? empRes.value?.data?.total_employees ?? 0
          : null,
    };
  }, []);

  const loadAll = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) setRefreshing(true);
      else setLoading(true);
      setError("");

      try {
        const data = await fetchCompany();
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

        const statsData = await fetchStats();
        setStats(statsData);
      } catch (err) {
        const msg =
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to load company details";
        setError(typeof msg === "string" ? msg : "Failed to load company details");
        setCompany(null);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [fetchCompany, fetchStats, reset]
  );

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  /* ─────────────── SUBMIT ─────────────── */

  const onSubmit = async (values) => {
    if (!companyId) {
      toast.error("Company ID not found");
      return;
    }

    setSaving(true);
    setError("");
    try {
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
      };

      const res = await api.put(`/api/v1/update/company/${companyId}`, payload);

      if (res.data?.success || res.status === 200) {
        toast.success("Company details updated successfully!");
        setMode("view");
        await loadAll({ silent: true });
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
    setActiveTab("overview");
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

  /* ─────────────── DERIVED ─────────────── */

  const formattedAddress = useMemo(() => {
    if (!company) return "—";
    const parts = [
      company.company_address,
      company.company_city,
      company.company_state,
      company.company_country,
      company.company_zipcode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "—";
  }, [company]);

  const handleCopy = async (key, value) => {
    if (!value) return;
    const ok = await copyText(value);
    if (ok) {
      setCopied(key);
      setTimeout(() => setCopied(""), 1800);
    }
  };

  /* ─────────────── LOADING ─────────────── */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#E42527]" />
          <p className="text-slate-600 text-sm">Loading company details…</p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     VIEW MODE
     ═══════════════════════════════════════════════════════ */
  if (mode === "view") {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* ─── BREADCRUMB BAR ─── */}
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="hover:text-slate-700">Dashboard</span>
              <ChevronRight className="h-3 w-3" />
              <span className="hover:text-slate-700">Settings</span>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-slate-900">Company Profile</span>
            </nav>
          </div>
        </div>

        {/* ─── HERO ─── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E42527] blur-3xl" />
            <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-blue-500 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-5 flex-1 min-w-0">
                {/* Logo */}
                <div className="shrink-0">
                  {company?.company_logo ? (
                    <img
                      src={company.company_logo}
                      alt="Logo"
                      className="h-20 w-20 rounded-2xl bg-white object-contain p-2 shadow-2xl ring-2 ring-white/20"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 to-white/5 text-2xl font-bold shadow-2xl ring-2 ring-white/20 backdrop-blur">
                      {initialsOf(company?.company_name) || (
                        <Building2 className="h-9 w-9 text-white/80" />
                      )}
                    </div>
                  )}
                </div>

                {/* Name + meta */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">
                      {company?.company_name || "—"}
                    </h1>
                    {company?.email_verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                        company?.active_status !== false
                          ? "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30"
                          : "bg-slate-500/20 text-slate-300 ring-slate-500/30"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          company?.active_status !== false
                            ? "bg-emerald-400"
                            : "bg-slate-400"
                        }`}
                      />
                      {company?.active_status !== false ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-300">
                    <button
                      type="button"
                      onClick={() => handleCopy("hero-email", company?.company_email)}
                      className="inline-flex items-center gap-1.5 hover:text-white transition"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {company?.company_email || "—"}
                      {copied === "hero-email" && (
                        <Check className="h-3 w-3 text-emerald-400" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy("hero-mobile", company?.company_mobile)}
                      className="inline-flex items-center gap-1.5 hover:text-white transition"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {company?.company_mobile || "—"}
                      {copied === "hero-mobile" && (
                        <Check className="h-3 w-3 text-emerald-400" />
                      )}
                    </button>
                    {company?.company_landline && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        {company.company_landline}
                      </span>
                    )}
                  </div>

                  {/* Chips */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy("company-id", companyId)}
                      className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-mono text-slate-200 ring-1 ring-white/20 transition hover:bg-white/20"
                    >
                      <Hash className="h-3 w-3 text-slate-400" />
                      {companyId || "—"}
                      {copied === "company-id" ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-slate-400" />
                      )}
                    </button>

                    {company?.company_established_date && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-medium text-amber-200 ring-1 ring-amber-500/30">
                        <Calendar className="h-3 w-3" />
                        Est. {formatDate(company.company_established_date)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  onClick={() => loadAll({ silent: true })}
                  disabled={refreshing}
                  variant="ghost"
                  className="gap-2 text-white hover:bg-white/10"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">
                    {refreshing ? "Refreshing…" : "Refresh"}
                  </span>
                </Button>
                <Button
                  onClick={startEdit}
                  className="gap-2 bg-white text-slate-900 shadow-lg hover:bg-slate-100"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Company
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MAIN CONTENT (no overlap) ─── */}
        <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="flex-1 text-sm font-medium text-red-800">{error}</p>
              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ─── STATS ─── */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={<Users className="h-5 w-5" />}
              label="Total Employees"
              value={stats.employees ?? "—"}
              tone="blue"
              trend="+12 this month"
            />
            <StatCard
              icon={<Layers className="h-5 w-5" />}
              label="Departments"
              value={stats.departments ?? "—"}
              tone="violet"
              trend="Active"
            />
            <StatCard
              icon={<MapPinned className="h-5 w-5" />}
              label="Locations"
              value={stats.locations ?? "—"}
              tone="emerald"
              trend="Pan India"
            />
            <StatCard
              icon={<Calendar className="h-5 w-5" />}
              label="Established"
              value={formatDate(company?.company_established_date)}
              tone="amber"
              trend={
                company?.company_established_date
                  ? `${new Date().getFullYear() -
                      new Date(company.company_established_date).getFullYear()} yrs`
                  : "—"
              }
            />
          </div>

          {/* ─── TABS ─── */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-2">
              <div className="flex flex-wrap gap-1">
                {[
                  { id: "overview", label: "Overview", icon: <Building className="h-4 w-4" /> },
                  { id: "contact", label: "Contact", icon: <Phone className="h-4 w-4" /> },
                  { id: "address", label: "Address", icon: <MapPin className="h-4 w-4" /> },
                  { id: "preferences", label: "Preferences", icon: <Settings2 className="h-4 w-4" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative inline-flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition ${
                      activeTab === tab.id
                        ? "text-[#E42527]"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#E42527]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <OverviewTab
                  company={company}
                  formattedAddress={formattedAddress}
                  stats={stats}
                />
              )}
              {activeTab === "contact" && (
                <ContactTab company={company} onCopy={handleCopy} copied={copied} />
              )}
              {activeTab === "address" && <AddressTab company={company} />}
              {activeTab === "preferences" && <PreferencesTab company={company} />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     EDIT MODE
     ═══════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="hover:text-slate-700">Dashboard</span>
            <ChevronRight className="h-3 w-3" />
            <span className="hover:text-slate-700">Settings</span>
            <ChevronRight className="h-3 w-3" />
            <span className="hover:text-slate-700">Company Profile</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-slate-900">Edit</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E42527] to-[#c91f21] text-white shadow-lg shadow-red-200">
                <Pencil className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Edit Company</h1>
                <p className="text-sm text-slate-500">
                  Update information used on letters and documents
                </p>
              </div>
            </div>

            <Button type="button" variant="outline" onClick={cancelEdit} className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Error */}
      <div className="mx-auto max-w-5xl px-6 mt-6">
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="flex-1 text-sm font-medium text-red-800">{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-5xl px-6 py-6 space-y-6"
      >
        <FormSection
          icon={<Building2 className="h-5 w-5" />}
          title="Basic Information"
          subtitle="Core company details"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                placeholder="Your Company Name"
                className="h-11"
                {...register("company_name")}
              />
              {errors.company_name && (
                <p className="text-xs text-red-500">{errors.company_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_email">Email Address *</Label>
              <Input
                id="company_email"
                type="email"
                placeholder="company@example.com"
                className="h-11"
                {...register("company_email")}
              />
              {errors.company_email && (
                <p className="text-xs text-red-500">{errors.company_email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_mobile">Mobile *</Label>
              <Input
                id="company_mobile"
                placeholder="+91 98765 43210"
                className="h-11"
                {...register("company_mobile")}
              />
              {errors.company_mobile && (
                <p className="text-xs text-red-500">{errors.company_mobile.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_landline">Landline</Label>
              <Input
                id="company_landline"
                placeholder="Optional"
                className="h-11"
                {...register("company_landline")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_established_date">Established Date</Label>
              <Input
                id="company_established_date"
                type="date"
                className="h-11"
                defaultValue={
                  company?.company_established_date
                    ? String(company.company_established_date).slice(0, 10)
                    : ""
                }
                disabled
              />
              <p className="text-xs text-slate-400">Contact admin to change</p>
            </div>
          </div>
        </FormSection>

        <FormSection
          icon={<Palette className="h-5 w-5" />}
          title="Branding"
          subtitle="Logo shown on letterheads and payslips"
        >
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[200px_1fr]">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
              {watchedLogo ? (
                <img
                  src={watchedLogo}
                  alt="Logo Preview"
                  className="h-24 w-24 rounded-xl bg-white object-contain p-2 shadow-sm ring-1 ring-slate-200"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-white text-3xl font-bold text-slate-300 shadow-sm ring-1 ring-slate-200">
                  {initialsOf(watch("company_name")) || (
                    <Building2 className="h-10 w-10 text-slate-300" />
                  )}
                </div>
              )}
              <p className="mt-3 text-xs text-slate-500">Preview</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_logo">Logo URL</Label>
              <Input
                id="company_logo"
                placeholder="https://cdn.company.com/logo.png"
                className="h-11"
                {...register("company_logo")}
              />
              <p className="text-xs text-slate-400">
                Public image URL (PNG/JPG/SVG). Recommended: 200×200, transparent background.
              </p>
            </div>
          </div>
        </FormSection>

        <FormSection
          icon={<MapPin className="h-5 w-5" />}
          title="Address"
          subtitle="Appears on official letters and invoices"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="company_address">Street Address</Label>
              <Input
                id="company_address"
                placeholder="Plot / Building, Street"
                className="h-11"
                {...register("company_address")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_city">City</Label>
              <Input id="company_city" placeholder="Gurugram" className="h-11" {...register("company_city")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_state">State</Label>
              <Input id="company_state" placeholder="Haryana" className="h-11" {...register("company_state")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_country">Country</Label>
              <Input id="company_country" placeholder="India" className="h-11" {...register("company_country")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_zipcode">PIN / Zip Code</Label>
              <Input id="company_zipcode" placeholder="122015" className="h-11" {...register("company_zipcode")} />
            </div>
          </div>
        </FormSection>
      </form>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="text-sm">
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 text-amber-600">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Unsaved changes
              </span>
            ) : (
              <span className="text-slate-400">No changes yet</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={cancelEdit} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              className="gap-2 bg-[#E42527] hover:bg-[#c91f21]"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════ */

const TONE = {
  blue: {
    card: "border-blue-100 bg-gradient-to-br from-blue-50 to-white",
    icon: "bg-blue-100 text-blue-600",
    label: "text-blue-600",
  },
  violet: {
    card: "border-violet-100 bg-gradient-to-br from-violet-50 to-white",
    icon: "bg-violet-100 text-violet-600",
    label: "text-violet-600",
  },
  emerald: {
    card: "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white",
    icon: "bg-emerald-100 text-emerald-600",
    label: "text-emerald-600",
  },
  amber: {
    card: "border-amber-100 bg-gradient-to-br from-amber-50 to-white",
    icon: "bg-amber-100 text-amber-600",
    label: "text-amber-600",
  },
};

function StatCard({ icon, label, value, tone = "blue", trend }) {
  const t = TONE[tone];
  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${t.card}`}>
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.icon}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {trend}
          </span>
        )}
      </div>
      <p className={`mt-3 text-[11px] font-semibold uppercase tracking-wide ${t.label}`}>
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value === null || value === undefined ? "—" : value}
      </p>
    </div>
  );
}

function FormSection({ icon, title, subtitle, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InfoTile({ icon, label, value, mono, verified, highlight }) {
  return (
    <div
      className={`rounded-xl border p-4 transition hover:shadow-sm ${
        highlight
          ? "border-blue-100 bg-blue-50/40"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          {icon}
          <span className="text-[11px] font-semibold uppercase tracking-wide">
            {label}
          </span>
        </div>
        {verified && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
      </div>
      <p
        className={`mt-2 text-sm font-medium text-slate-900 break-all ${
          mono ? "font-mono" : ""
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle, badge }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-[#E42527]">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      {badge}
    </div>
  );
}

function OverviewTab({ company, formattedAddress, stats }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Company Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            icon={<Building2 className="h-5 w-5" />}
            title="Company Information"
            subtitle="Core identity and account details"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoTile
              icon={<Building2 className="h-3.5 w-3.5" />}
              label="Company Name"
              value={company?.company_name}
            />
            <InfoTile
              icon={<Hash className="h-3.5 w-3.5" />}
              label="Company ID"
              value={company?.company_id}
              mono
            />
            <InfoTile
              icon={<Calendar className="h-3.5 w-3.5" />}
              label="Established Date"
              value={formatDate(company?.company_established_date)}
            />
            <InfoTile
              icon={<Activity className="h-3.5 w-3.5" />}
              label="Account Status"
              value={company?.active_status !== false ? "Active" : "Inactive"}
            />
            <InfoTile
              icon={<Layers className="h-3.5 w-3.5" />}
              label="Total Departments"
              value={stats?.departments ?? "—"}
            />
            <InfoTile
              icon={<Users className="h-3.5 w-3.5" />}
              label="Total Employees"
              value={stats?.employees ?? "—"}
            />
          </div>
        </div>

        {/* Registered Address */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            icon={<MapPin className="h-5 w-5" />}
            title="Registered Address"
            subtitle="Appears on letters and invoices"
          />

          <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/60 p-5 ring-1 ring-slate-100">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1 text-sm leading-6 text-slate-700">
                <p className="font-semibold text-slate-900">{company?.company_name}</p>
                {company?.company_address && <p>{company.company_address}</p>}
                <p>
                  {[company?.company_city, company?.company_state]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </p>
                <p>
                  {[company?.company_country, company?.company_zipcode]
                    .filter(Boolean)
                    .join(" - ") || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span className="break-all">
              <span className="font-medium text-slate-700">One-line:</span> {formattedAddress}
            </span>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        {/* Created via */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/40 p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <Mail className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-blue-900">Created via</h3>
          </div>
          <p className="text-xs text-blue-700/80 leading-5">
            Primary email used to create this company account. All company
            notifications are sent here.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 ring-1 ring-blue-100">
            <Mail className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="text-sm font-medium text-slate-900 truncate">
              {company?.company_email || "—"}
            </span>
            {company?.email_verified ? (
              <BadgeCheck className="h-4 w-4 text-emerald-500 shrink-0 ml-auto" />
            ) : (
              <span className="ml-auto text-[10px] uppercase text-amber-600 font-semibold">
                Unverified
              </span>
            )}
          </div>
        </div>

        {/* Verification */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Verification"
            subtitle="Account trust status"
          />

          <div className="space-y-2.5">
            <VerifyRow label="Email Verified" value={company?.email_verified} />
            <VerifyRow label="Mobile Verified" value={company?.mobile_verified} />
            <VerifyRow
              label="Account Status"
              value={company?.active_status !== false}
              textValue={company?.active_status !== false ? "Active" : "Inactive"}
            />
          </div>
        </div>

        {/* Metadata */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            icon={<Sparkles className="h-5 w-5" />}
            title="Metadata"
            subtitle="System information"
          />

          <div className="space-y-3 text-sm">
            <MetaRow label="Created" value={formatDate(company?.created_at)} />
            <MetaRow label="Last Updated" value={formatDate(company?.updated_at)} />
            <MetaRow
              label="Established"
              value={formatDate(company?.company_established_date)}
            />
            <MetaRow label="Timezone" value={company?.timezone || "Asia/Kolkata"} />
            <MetaRow label="Currency" value={company?.currency || "INR"} />
          </div>
        </div>

        {/* Pro tip */}
        <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-amber-100/40 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">Pro tip</p>
              <p className="mt-1 text-xs leading-5 text-amber-800">
                Keep your address and logo updated — they appear on all
                generated letters, payslips, and offer letters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactTab({ company, onCopy, copied }) {
  return (
    <div>
      <SectionHeader
        icon={<Phone className="h-5 w-5" />}
        title="Contact Information"
        subtitle="Ways to reach your company"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ContactCard
          icon={<Mail className="h-5 w-5" />}
          label="Company Email"
          sublabel="Created via"
          value={company?.company_email}
          verified={company?.email_verified}
          tone="blue"
          onCopy={() => onCopy("email", company?.company_email)}
          copied={copied === "email"}
        />
        <ContactCard
          icon={<Phone className="h-5 w-5" />}
          label="Mobile Number"
          value={company?.company_mobile}
          verified={company?.mobile_verified}
          tone="emerald"
          onCopy={() => onCopy("mobile", company?.company_mobile)}
          copied={copied === "mobile"}
        />
        <ContactCard
          icon={<Phone className="h-5 w-5" />}
          label="Landline"
          value={company?.company_landline || "Not provided"}
          tone="slate"
        />
      </div>
    </div>
  );
}

function ContactCard({
  icon,
  label,
  sublabel,
  value,
  verified,
  tone = "blue",
  onCopy,
  copied,
}) {
  const bg = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-100 text-slate-500",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-sm">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${bg[tone]}`}>
        {icon}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        {verified && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
      </div>
      {sublabel && (
        <p className="mt-0.5 text-[10px] uppercase tracking-wide text-blue-500 font-semibold">
          {sublabel}
        </p>
      )}
      <div className="mt-1.5 flex items-center gap-2">
        <p className="text-sm font-medium text-slate-900 break-words flex-1">
          {value || "—"}
        </p>
        {onCopy && value && (
          <button
            type="button"
            onClick={onCopy}
            className="text-slate-400 hover:text-slate-700 transition shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function AddressTab({ company }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeader
          icon={<MapPin className="h-5 w-5" />}
          title="Full Address"
          subtitle="Structured view of registered address"
        />

        <div className="space-y-4">
          <AddressRow label="Street" value={company?.company_address} />
          <AddressRow label="City" value={company?.company_city} />
          <AddressRow label="State" value={company?.company_state} />
          <AddressRow label="Country" value={company?.company_country} />
          <AddressRow label="PIN / Zip" value={company?.company_zipcode} mono />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeader
          icon={<FileText className="h-5 w-5" />}
          title="Formatted Address"
          subtitle="Used on generated letters"
        />

        <div className="rounded-xl bg-slate-900 p-5 text-white shadow-inner">
          <p className="text-sm font-semibold">{company?.company_name}</p>
          <div className="mt-2 space-y-0.5 text-sm text-slate-300">
            {company?.company_address && <p>{company.company_address}</p>}
            <p>
              {[company?.company_city, company?.company_state]
                .filter(Boolean)
                .join(", ") || "—"}
            </p>
            <p>
              {[company?.company_country, company?.company_zipcode]
                .filter(Boolean)
                .join(" - ") || "—"}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>This exact format appears on letterheads, payslips, and offer letters.</span>
        </div>
      </div>
    </div>
  );
}

function AddressRow({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span
        className={`text-sm font-medium text-slate-900 text-right ml-4 break-all ${
          mono ? "font-mono" : ""
        }`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function PreferencesTab({ company }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeader
          icon={<Globe2 className="h-5 w-5" />}
          title="Regional Settings"
          subtitle="Locale and format preferences"
        />

        <div className="space-y-3">
          <PreferenceRow
            icon={<Globe2 className="h-4 w-4" />}
            label="Timezone"
            value={company?.timezone || "Asia/Kolkata"}
          />
          <PreferenceRow
            icon={<MapPin className="h-4 w-4" />}
            label="Country"
            value={company?.company_country || "IN"}
          />
          <PreferenceRow
            icon={<Wallet className="h-4 w-4" />}
            label="Currency"
            value={company?.currency || "INR"}
          />
          <PreferenceRow
            icon={<Calendar className="h-4 w-4" />}
            label="Date Format"
            value={company?.date_format || "DD/MM/YYYY"}
          />
          <PreferenceRow
            icon={<Clock className="h-4 w-4" />}
            label="Time Format"
            value={company?.time_format || "12h"}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeader
          icon={<Settings2 className="h-5 w-5" />}
          title="Business Settings"
          subtitle="Company-wide configuration"
        />

        <div className="space-y-3">
          <PreferenceRow
            icon={<TrendingUp className="h-4 w-4" />}
            label="Fiscal Year Start"
            value={`Month ${company?.fiscal_year_start || 4}`}
          />
          <PreferenceRow
            icon={<Calendar className="h-4 w-4" />}
            label="Week Start"
            value={company?.week_start === 0 ? "Monday" : "Sunday"}
          />
          <PreferenceRow
            icon={<Key className="h-4 w-4" />}
            label="Employee Code Prefix"
            value={company?.employee_code_prefix || "—"}
          />
        </div>
      </div>
    </div>
  );
}

function PreferenceRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 transition hover:bg-slate-100">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-100">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-900 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

function VerifyRow({ label, value, textValue }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      {value ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {textValue || "Verified"}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
          <X className="h-3.5 w-3.5" />
          {textValue || "Not verified"}
        </span>
      )}
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-medium text-slate-700 text-right ml-4">
        {value}
      </span>
    </div>
  );
}