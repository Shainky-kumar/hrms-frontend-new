
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { toast } from "sonner";
// import { Eye, EyeOff, Loader2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import { signupSchema } from "@/lib/validations/auth";
// import { api } from "@/lib/api";

// export default function SignupPage() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(signupSchema),
//   });

//   // Normal Signup
//   const onSubmit = async (values) => {
//     setLoading(true);

//     try {
//       const { confirm_password, ...payload } = values;

//       const res = await api.post(
//         "/api/v1/signup/company",
//         payload
//       );

//       if (res.data.success) {
//         toast.success("Account created! Please log in.");
//         router.push("/login");
//       }
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.detail ||
//           "Something went wrong"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Google Login / Signup
//   const handleGoogleAuth = () => {
//     setGoogleLoading(true);

//     window.location.href =
//       "http://localhost:8000/api/v1/auth/google/login";
//   };

//   return (
//     <div className="animate-fadeInUp">
//       <div className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 sm:p-7 space-y-5">
//         {/* HEADER */}
//         <div className="space-y-1.5">
//           <div className="lg:hidden h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-red-700 flex items-center justify-center font-bold text-white text-base mb-4">
//             E
//           </div>

//           <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
//             Create your workspace
//           </h1>

//           <p className="text-sm text-slate-500">
//             Set up your company in under a minute
//           </p>
//         </div>

//         {/* GOOGLE BUTTON */}
//         <button
//           type="button"
//           onClick={handleGoogleAuth}
//           disabled={loading || googleLoading}
//           className="w-full h-11 rounded-md border border-slate-200 flex items-center justify-center gap-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
//         >
//           {googleLoading ? (
//             <Loader2 className="h-4 w-4 animate-spin" />
//           ) : (
//             <svg className="h-4 w-4" viewBox="0 0 24 24">
//               <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//               <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//               <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
//               <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//             </svg>
//           )}
//           {googleLoading ? "Connecting to Google..." : "Continue with Google"}
//         </button>

//         {/* OR */}
//         <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-slate-200" />
//           </div>

//           <div className="relative flex justify-center text-xs">
//             <span className="bg-white px-3 text-slate-400">or</span>
//           </div>
//         </div>

//         {/* SIGNUP FORM */}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

//           {/* Email */}
//           <div className="space-y-1.5">
//             <Label htmlFor="company_email" className="text-slate-700 text-sm font-medium">
//               Email address
//             </Label>

//             <Input
//               id="company_email"
//               type="email"
//               placeholder="you@company.com"
//               className="h-11 bg-slate-50/50 border-slate-200 focus-visible:bg-white transition-colors"
//               {...register("company_email")}
//             />

//             {errors.company_email && (
//               <p className="text-xs text-red-500 pl-0.5">{errors.company_email.message}</p>
//             )}
//           </div>

//           {/* First Name + Last Name */}
//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-1.5">
//               <Label htmlFor="first_name" className="text-slate-700 text-sm font-medium">
//                 First name
//               </Label>

//               <Input
//                 id="first_name"
//                 placeholder="John"
//                 className="h-11 bg-slate-50/50 border-slate-200 focus-visible:bg-white transition-colors"
//                 {...register("first_name")}
//               />

//               {errors.first_name && (
//                 <p className="text-xs text-red-500 pl-0.5">{errors.first_name.message}</p>
//               )}
//             </div>

//             <div className="space-y-1.5">
//               <Label htmlFor="last_name" className="text-slate-700 text-sm font-medium">
//                 Last name
//               </Label>

//               <Input
//                 id="last_name"
//                 placeholder="Doe"
//                 className="h-11 bg-slate-50/50 border-slate-200 focus-visible:bg-white transition-colors"
//                 {...register("last_name")}
//               />

//               {errors.last_name && (
//                 <p className="text-xs text-red-500 pl-0.5">{errors.last_name.message}</p>
//               )}
//             </div>
//           </div>

//           {/* PASSWORD */}
//           <div className="space-y-1.5">
//             <Label htmlFor="password" className="text-slate-700 text-sm font-medium">
//               Password
//             </Label>

//             <div className="relative">
//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 className="h-11 pr-10 bg-slate-50/50 border-slate-200 focus-visible:bg-white transition-colors"
//                 {...register("password")}
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowPassword((value) => !value)}
//                 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
//               >
//                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//               </button>
//             </div>

//             {errors.password && (
//               <p className="text-xs text-red-500 pl-0.5">{errors.password.message}</p>
//             )}
//           </div>

//           {/* CONFIRM PASSWORD */}
//           <div className="space-y-1.5">
//             <Label htmlFor="confirm_password" className="text-slate-700 text-sm font-medium">
//               Confirm password
//             </Label>

//             <Input
//               id="confirm_password"
//               type={showPassword ? "text" : "password"}
//               placeholder="••••••••"
//               className="h-11 bg-slate-50/50 border-slate-200 focus-visible:bg-white transition-colors"
//               {...register("confirm_password")}
//             />

//             {errors.confirm_password && (
//               <p className="text-xs text-red-500 pl-0.5">{errors.confirm_password.message}</p>
//             )}
//           </div>

//           {/* CREATE ACCOUNT BUTTON */}
//           <Button
//             type="submit"
//             disabled={loading || googleLoading}
//             className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5 mt-1"
//           >
//             {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
//           </Button>

//         </form>
//       </div>

//       {/* LOGIN LINK */}
//       <p className="text-sm text-center text-slate-500 mt-6">
//         Already have an account?{" "}
//         <Link href="/login" className="text-primary font-medium hover:underline">
//           Log in
//         </Link>
//       </p>

//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { toast } from "sonner";
// import { Eye, EyeOff, Loader2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import { signupSchema } from "@/lib/validations/auth";
// import { api } from "@/lib/api";

// export default function SignupPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: zodResolver(signupSchema) });

//   const onSubmit = async (values) => {
//     setLoading(true);
//     try {
//       const { confirm_password, ...payload } = values;
//       const res = await api.post("/api/v1/signup/company", payload);
//       if (res.data.success) {
//         toast.success("Account created! Please log in.");
//         router.push("/login");
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.detail || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-7">
//       <div className="space-y-1.5">
//         <h1 className="text-2xl font-semibold text-slate-900">Create your workspace</h1>
//         <p className="text-sm text-slate-500">Set up your company in under a minute</p>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div className="space-y-1.5">
//           <Label htmlFor="company_name" className="text-slate-700">Company name</Label>
//           <Input id="company_name" placeholder="Acme Pvt Ltd" className="h-11" {...register("company_name")} />
//           {errors.company_name && <p className="text-xs text-red-500">{errors.company_name.message}</p>}
//         </div>

//         <div className="grid grid-cols-2 gap-3">
//           <div className="space-y-1.5">
//             <Label htmlFor="company_email" className="text-slate-700">Company email</Label>
//             <Input id="company_email" type="email" placeholder="hr@acme.com" className="h-11" {...register("company_email")} />
//             {errors.company_email && <p className="text-xs text-red-500">{errors.company_email.message}</p>}
//           </div>
//           <div className="space-y-1.5">
//             <Label htmlFor="company_mobile" className="text-slate-700">Mobile</Label>
//             <Input id="company_mobile" placeholder="9876543210" className="h-11" {...register("company_mobile")} />
//             {errors.company_mobile && <p className="text-xs text-red-500">{errors.company_mobile.message}</p>}
//           </div>
//         </div>

//         <div className="pt-1">
//           <div className="h-px bg-slate-200 mb-4" />
//           <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Admin account</p>
//         </div>

//         <div className="grid grid-cols-2 gap-3">
//           <div className="space-y-1.5">
//             <Label htmlFor="first_name" className="text-slate-700">First name</Label>
//             <Input id="first_name" placeholder="Shainky" className="h-11" {...register("first_name")} />
//             {errors.first_name && <p className="text-xs text-red-500">{errors.first_name.message}</p>}
//           </div>
//           <div className="space-y-1.5">
//             <Label htmlFor="last_name" className="text-slate-700">Last name</Label>
//             <Input id="last_name" placeholder="Kumar" className="h-11" {...register("last_name")} />
//             {errors.last_name && <p className="text-xs text-red-500">{errors.last_name.message}</p>}
//           </div>
//         </div>

//         <div className="space-y-1.5">
//           <Label htmlFor="password" className="text-slate-700">Password</Label>
//           <div className="relative">
//             <Input
//               id="password"
//               type={showPassword ? "text" : "password"}
//               placeholder="Minimum 8 characters"
//               className="h-11 pr-10"
//               {...register("password")}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((v) => !v)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//             >
//               {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//             </button>
//           </div>
//           {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
//         </div>

//         <div className="space-y-1.5">
//           <Label htmlFor="confirm_password" className="text-slate-700">Confirm password</Label>
//           <Input
//             id="confirm_password"
//             type={showPassword ? "text" : "password"}
//             placeholder="Re-enter password"
//             className="h-11"
//             {...register("confirm_password")}
//           />
//           {errors.confirm_password && <p className="text-xs text-red-500">{errors.confirm_password.message}</p>}
//         </div>

//         <Button
//           type="submit"
//           disabled={loading}
//           className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium mt-2"
//         >
//           {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
//         </Button>
//       </form>

//       <p className="text-sm text-center text-slate-500">
//         Already have an account?{" "}
//         <Link href="/login" className="text-primary font-medium hover:underline">
//           Log in
//         </Link>
//       </p>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signupSchema } from "@/lib/validations/auth";
import { api } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  // Normal Signup
  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const { confirm_password, ...payload } = values;

      const res = await api.post(
        "/api/v1/signup/company",
        payload
      );

      if (res.data.success) {
        toast.success("Account created! Please log in.");
        router.push("/login");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // Google Login / Signup
  const handleGoogleAuth = () => {
    setGoogleLoading(true);

    window.location.href =
      "http://localhost:8000/api/v1/auth/google/login";
  };

  return (
    <div className="animate-fadeInUp w-full">
      <div className="max-h-[calc(100vh-5rem)] overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-3 sm:p-4">
        <div className="space-y-1.5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-red-700 text-base font-bold text-white lg:hidden">
            E
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Create your workspace
          </h1>

          <p className="text-sm text-slate-500">
            Set up your company in under a minute
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={googleLoading || loading}
          className="flex h-10 w-full items-center justify-center gap-2.5 rounded-md border border-slate-200 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          {googleLoading ? "Connecting to Google..." : "Continue with Google"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>

          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="company_name" className="text-slate-700 text-sm font-medium">
              Company name
            </Label>

            <Input
              id="company_name"
              placeholder="Acme Pvt Ltd"
              className="h-10 border-slate-200 bg-slate-50/50 transition-colors focus-visible:bg-white"
              {...register("company_name")}
            />

            {errors.company_name && (
              <p className="text-xs text-red-500 pl-0.5">{errors.company_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="company_email" className="text-slate-700 text-sm font-medium">
                Company email
              </Label>

              <Input
                id="company_email"
                type="email"
                placeholder="hr@acme.com"
                className="h-10 border-slate-200 bg-slate-50/50 transition-colors focus-visible:bg-white"
                {...register("company_email")}
              />

              {errors.company_email && (
                <p className="text-xs text-red-500 pl-0.5">{errors.company_email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company_mobile" className="text-slate-700 text-sm font-medium">
                Mobile
              </Label>

              <Input
                id="company_mobile"
                placeholder="9876543210"
                className="h-10 border-slate-200 bg-slate-50/50 transition-colors focus-visible:bg-white"
                {...register("company_mobile")}
              />

              {errors.company_mobile && (
                <p className="text-xs text-red-500 pl-0.5">{errors.company_mobile.message}</p>
              )}
            </div>
          </div>

          <div className="pt-1">
            <div className="mb-3 h-px bg-slate-200" />
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Admin account
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="first_name" className="text-slate-700 text-sm font-medium">
                First name
              </Label>

              <Input
                id="first_name"
                placeholder="Shainky"
                className="h-10 border-slate-200 bg-slate-50/50 transition-colors focus-visible:bg-white"
                {...register("first_name")}
              />

              {errors.first_name && (
                <p className="text-xs text-red-500 pl-0.5">{errors.first_name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="last_name" className="text-slate-700 text-sm font-medium">
                Last name
              </Label>

              <Input
                id="last_name"
                placeholder="Kumar"
                className="h-10 border-slate-200 bg-slate-50/50 transition-colors focus-visible:bg-white"
                {...register("last_name")}
              />

              {errors.last_name && (
                <p className="text-xs text-red-500 pl-0.5">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-slate-700 text-sm font-medium">
              Password
            </Label>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-10 border-slate-200 bg-slate-50/50 pr-10 transition-colors focus-visible:bg-white"
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {errors.password && (
              <p className="text-xs text-red-500 pl-0.5">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm_password" className="text-slate-700 text-sm font-medium">
              Confirm password
            </Label>

            <Input
              id="confirm_password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-10 border-slate-200 bg-slate-50/50 transition-colors focus-visible:bg-white"
              {...register("confirm_password")}
            />

            {errors.confirm_password && (
              <p className="text-xs text-red-500 pl-0.5">{errors.confirm_password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="mt-1 h-10 w-full bg-primary text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/30"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
          </Button>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}