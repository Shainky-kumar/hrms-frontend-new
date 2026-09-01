
// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { toast } from "sonner";
// import {
//   Eye,
//   EyeOff,
//   Loader2,
//   Mail,
//   Lock,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";

// import { loginSchema } from "@/app/lib/validations/auth";
// import { api } from "@/app/lib/api";
// import { useAuthStore } from "@/app/store/authStore";

// export const dynamic = 'force-dynamic';
// export const runtime = 'edge';

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";



// export default function LoginPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const setAuth = useAuthStore((state) => state.setAuth);

//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const hasHandledCallback = useRef(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(loginSchema),
//   });

//   // =====================================================
//   // GOOGLE CALLBACK HANDLING — page load pe hi check karo
//   // =====================================================

//   useEffect(() => {
//     if (hasHandledCallback.current) return;

//     const accessToken = searchParams.get("access_token");
//     const refreshToken = searchParams.get("refresh_token");
//     const error = searchParams.get("error");

//     // Agar koi google params hi nahi hain, to normal login page hai — kuch mat karo
//     if (!accessToken && !refreshToken && !error) return;

//     hasHandledCallback.current = true;

//     if (error) {
//       const messages = {
//         not_registered: "User not registered in HRMS",
//       };
//       toast.error(messages[error] || "Google login failed");
//       router.replace("/login"); // URL se query params hata do
//       return;
//     }

//     if (accessToken && refreshToken) {
//       setGoogleLoading(true);

//       api
//         .get("/api/v1/me", {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         })
//         .then((res) => {
//           const user = res.data.data || res.data;
//           setAuth(user, accessToken, refreshToken);
//           toast.success(`Welcome, ${user.first_name}!`);
//           router.push("/dashboard");
//         })
//         .catch(() => {
//           toast.error("Login failed, please try again");
//           setGoogleLoading(false);
//           router.replace("/login");
//         });
//     }
//   }, [searchParams]);

//   // =====================================================
//   // NORMAL EMAIL + PASSWORD LOGIN
//   // =====================================================

//   const onSubmit = async (values) => {
//     setLoading(true);

//     try {
//       const res = await api.post("/api/v1/login/user", values);

//       if (res.data.success) {
//         const { access_token, refresh_token, user } = res.data.data;

//         setAuth(user, access_token, refresh_token);

//         toast.success(`Welcome back, ${user.first_name}!`);

//         router.push("/dashboard");
//       }
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.detail || "Invalid email or password"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // GOOGLE LOGIN — redirect start
//   // =====================================================

//   const handleGoogleLogin = () => {
//     try {
//       setGoogleLoading(true);
//       window.location.href = `${API_URL}/api/v1/auth/google/login`;
//     } catch (error) {
//       console.error("Google login error:", error);
//       setGoogleLoading(false);
//       toast.error("Unable to connect with Google");
//     }
//   };

//   return (
//     <div className="animate-fadeInUp">
//       <div className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 sm:p-9 space-y-7">
//         {/* HEADER */}
//         <div className="space-y-1.5">
//           <div className="lg:hidden h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-red-700 flex items-center justify-center font-bold text-white text-base mb-4">
//             E
//           </div>

//           <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
//             Welcome back
//           </h1>

//           <p className="text-sm text-slate-500">
//             Log in to access your EZlife workspace
//           </p>
//         </div>

//         {/* EMAIL + PASSWORD FORM */}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//           {/* EMAIL */}
//           <div className="space-y-1.5">
//             <Label htmlFor="email" className="text-slate-700 text-sm font-medium">
//               Email address
//             </Label>

//             <div className="relative">
//               <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="you@company.com"
//                 className="h-11 pl-10 bg-slate-50/50 border-slate-200 focus-visible:bg-white transition-colors"
//                 {...register("email")}
//               />
//             </div>

//             {errors.email && (
//               <p className="text-xs text-red-500 pl-0.5">{errors.email.message}</p>
//             )}
//           </div>

//           {/* PASSWORD */}
//           <div className="space-y-1.5">
//             <div className="flex items-center justify-between">
//               <Label htmlFor="password" className="text-slate-700 text-sm font-medium">
//                 Password
//               </Label>

//               <Link href="/forgot-password" className="text-xs text-primary font-medium hover:underline">
//                 Forgot password?
//               </Link>
//             </div>

//             <div className="relative">
//               <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 className="h-11 pl-10 pr-10 bg-slate-50/50 border-slate-200 focus-visible:bg-white transition-colors"
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

//           {/* REMEMBER ME */}
//           <div className="flex items-center gap-2">
//             <Checkbox id="remember" />
//             <Label htmlFor="remember" className="text-sm font-normal text-slate-600 cursor-pointer">
//               Keep me signed in
//             </Label>
//           </div>

//           {/* NORMAL LOGIN BUTTON */}
//           <Button
//             type="submit"
//             disabled={loading || googleLoading}
//             className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5"
//           >
//             {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log in"}
//           </Button>
//         </form>

//         {/* OR */}
//         <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-slate-200" />
//           </div>

//           <div className="relative flex justify-center text-xs">
//             <span className="bg-white px-3 text-slate-400">or</span>
//           </div>
//         </div>

//         {/* CONTINUE WITH GOOGLE */}
//         <button
//           type="button"
//           onClick={handleGoogleLogin}
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
//       </div>

//       {/* SIGNUP */}
//       <p className="text-sm text-center text-slate-500 mt-6">
//         Don&apos;t have an account?{" "}
//         <Link href="/signup" className="text-primary font-medium hover:underline">
//           Create one
//         </Link>
//       </p>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { loginSchema } from "@/app/lib/validations/auth";
import { api } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setAuth = useAuthStore((state) => state.setAuth);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasHandledCallback = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // =====================================================
  // GOOGLE CALLBACK HANDLING — page load pe hi check karo
  // =====================================================

  useEffect(() => {
    if (hasHandledCallback.current) return;

    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const error = searchParams.get("error");

    // Agar koi google params hi nahi hain, to normal login page hai — kuch mat karo
    if (!accessToken && !refreshToken && !error) return;

    hasHandledCallback.current = true;

    if (error) {
      const messages = {
        not_registered: "User not registered in HRMS",
      };
      toast.error(messages[error] || "Google login failed");
      router.replace("/login"); // URL se query params hata do
      return;
    }

    if (accessToken && refreshToken) {
      api
        .get("/api/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          const user = res.data.data || res.data;
          setAuth(user, accessToken, refreshToken);
          toast.success(`Welcome, ${user.first_name}!`);
          router.push("/dashboard");
        })
        .catch(() => {
          toast.error("Login failed, please try again");
          setGoogleLoading(false);
          router.replace("/login");
        });
    }
  }, [searchParams]);

  // =====================================================
  // NORMAL EMAIL + PASSWORD LOGIN
  // =====================================================

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const res = await api.post("/api/v1/login/user", values);

      if (res.data.success) {
        const { access_token, refresh_token, user } = res.data.data;

        setAuth(user, access_token, refresh_token);

        toast.success(`Welcome back, ${user.first_name}!`);

        router.push("/dashboard");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.detail || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE LOGIN — redirect start
  // =====================================================

  const handleGoogleLogin = () => {
    try {
      setGoogleLoading(true);
      window.location.href = `${API_URL}/api/v1/auth/google/login`;
    } catch (error) {
      console.error("Google login error:", error);
      setGoogleLoading(false);
      toast.error("Unable to connect with Google");
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 sm:p-9 space-y-7">
        {/* HEADER */}
        <div className="space-y-1.5">
          <div className="lg:hidden h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-red-700 flex items-center justify-center font-bold text-white text-base mb-4">
            E
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Welcome back
          </h1>

          <p className="text-sm text-slate-500">
            Log in to access your EZlife workspace
          </p>
        </div>

        {/* EMAIL + PASSWORD FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* EMAIL */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-slate-700 text-sm font-medium">
              Email address
            </Label>

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="h-11 pl-10 bg-slate-50/50 border-slate-200 focus-visible:bg-white transition-colors"
                {...register("email")}
              />
            </div>

            {errors.email && (
              <p className="text-xs text-red-500 pl-0.5">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-700 text-sm font-medium">
                Password
              </Label>

              <Link href="/forgot-password" className="text-xs text-primary font-medium hover:underline">
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-11 pl-10 pr-10 bg-slate-50/50 border-slate-200 focus-visible:bg-white transition-colors"
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

          {/* REMEMBER ME */}
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm font-normal text-slate-600 cursor-pointer">
              Keep me signed in
            </Label>
          </div>

          {/* NORMAL LOGIN BUTTON */}
          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log in"}
          </Button>
        </form>

        {/* OR */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>

          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400">or</span>
          </div>
        </div>

        {/* CONTINUE WITH GOOGLE */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="w-full h-11 rounded-md border border-slate-200 flex items-center justify-center gap-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
      </div>

      {/* SIGNUP */}
      <p className="text-sm text-center text-slate-500 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary font-medium hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}