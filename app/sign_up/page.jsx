
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
    <div className="space-y-7">

      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold text-slate-900">
          Create your workspace
        </h1>

        <p className="text-sm text-slate-500">
          Set up your company in under a minute
        </p>
      </div>

      {/* Google Button */}
      <div className="space-y-4">

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleAuth}
          disabled={googleLoading}
          className="w-full h-11"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
              />

              <path
                fill="#34A853"
                d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.75z"
              />

              <path
                fill="#FBBC05"
                d="M6.54 13.83a5.87 5.87 0 0 1 0-3.66V7.64H3.3a9.75 9.75 0 0 0 0 8.72l3.24-2.53z"
              />

              <path
                fill="#EA4335"
                d="M12 6.14c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.14 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.7 5.39l3.24 2.53C7.31 7.86 9.46 6.14 12 6.14z"
              />
            </svg>
          )}

          Continue with Google
        </Button>

        {/* OR */}
        <div className="flex items-center gap-3">
          <div className="h-px bg-slate-200 flex-1" />

          <span className="text-xs text-slate-400">
            OR
          </span>

          <div className="h-px bg-slate-200 flex-1" />
        </div>

      </div>

      {/* Signup Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >

        {/* Company Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="company_name"
            className="text-slate-700"
          >
            Company name
          </Label>

          <Input
            id="company_name"
            placeholder="Acme Pvt Ltd"
            className="h-11"
            {...register("company_name")}
          />

          {errors.company_name && (
            <p className="text-xs text-red-500">
              {errors.company_name.message}
            </p>
          )}
        </div>

        {/* Company Email + Mobile */}
        <div className="grid grid-cols-2 gap-3">

          <div className="space-y-1.5">
            <Label
              htmlFor="company_email"
              className="text-slate-700"
            >
              Company email
            </Label>

            <Input
              id="company_email"
              type="email"
              placeholder="hr@acme.com"
              className="h-11"
              {...register("company_email")}
            />

            {errors.company_email && (
              <p className="text-xs text-red-500">
                {errors.company_email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="company_mobile"
              className="text-slate-700"
            >
              Mobile
            </Label>

            <Input
              id="company_mobile"
              placeholder="9876543210"
              className="h-11"
              {...register("company_mobile")}
            />

            {errors.company_mobile && (
              <p className="text-xs text-red-500">
                {errors.company_mobile.message}
              </p>
            )}
          </div>

        </div>

        {/* Admin Account */}
        <div className="pt-1">
          <div className="h-px bg-slate-200 mb-4" />

          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
            Admin account
          </p>
        </div>

        {/* First Name + Last Name */}
        <div className="grid grid-cols-2 gap-3">

          <div className="space-y-1.5">
            <Label
              htmlFor="first_name"
              className="text-slate-700"
            >
              First name
            </Label>

            <Input
              id="first_name"
              placeholder="Shainky"
              className="h-11"
              {...register("first_name")}
            />

            {errors.first_name && (
              <p className="text-xs text-red-500">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="last_name"
              className="text-slate-700"
            >
              Last name
            </Label>

            <Input
              id="last_name"
              placeholder="Kumar"
              className="h-11"
              {...register("last_name")}
            />

            {errors.last_name && (
              <p className="text-xs text-red-500">
                {errors.last_name.message}
              </p>
            )}
          </div>

        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-slate-700"
          >
            Password
          </Label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              className="h-11 pr-10"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((v) => !v)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="confirm_password"
            className="text-slate-700"
          >
            Confirm password
          </Label>

          <Input
            id="confirm_password"
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter password"
            className="h-11"
            {...register("confirm_password")}
          />

          {errors.confirm_password && (
            <p className="text-xs text-red-500">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        {/* Create Account */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium mt-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Create account"
          )}
        </Button>

      </form>

      {/* Login Link */}
      <p className="text-sm text-center text-slate-500">
        Already have an account?{" "}

        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Log in
        </Link>
      </p>

    </div>
  );
}