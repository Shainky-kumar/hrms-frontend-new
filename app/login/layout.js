"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users2,
  CalendarCheck,
  ClipboardCheck,
  TrendingUp,
} from "lucide-react";

import { useAuthStore } from "@/app/store/authStore";

const features = [
  {
    icon: Users2,
    title: "Workforce Management",
    text: "Manage your complete workforce from one dashboard.",
  },
  {
    icon: CalendarCheck,
    title: "Attendance & Leave",
    text: "Automate attendance and simplify leave tracking.",
  },
  {
    icon: ClipboardCheck,
    title: "Easy Onboarding",
    text: "Create a smooth onboarding experience for new hires.",
  },
  {
    icon: TrendingUp,
    title: "Performance Insights",
    text: "Get real-time visibility into employee performance.",
  },
];

export default function LoginLayout({ children }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (accessToken) {
      router.replace("/dashboard");
    }
  }, [accessToken, router]);

  if (accessToken) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F7F8FA]">
      {/* LEFT SIDE */}
      <div className="relative hidden min-h-screen w-[48%] overflow-hidden bg-[#111827] lg:flex">
        {/* Decorative background */}
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/10" />
        <div className="absolute -bottom-40 -left-40 h-[550px] w-[550px] rounded-full bg-primary/10" />
        <div className="absolute right-20 top-1/3 h-40 w-40 rounded-full border border-white/5" />

        <div className="relative z-10 flex w-full flex-col justify-between p-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white shadow-lg">
              E
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white">
                EZlife
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                HR Management
              </div>
            </div>
          </Link>

          {/* Main Content */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300">
              ✦ Modern HR Management Platform
            </div>

            <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight text-white">
              Everything HR,
              <br />
              <span className="text-primary">in one clean workspace.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
              Manage employees, attendance, leaves, onboarding,
              performance and more — all from one simple and
              powerful HR platform.
            </p>

            {/* Features */}
            <div className="mt-10 space-y-5">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">{title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>© 2026 EZlife</span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
        {/* Mobile Logo */}
        <div className="absolute left-6 top-6 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-bold text-white">
            E
          </div>
          <span className="font-semibold text-gray-900">EZlife</span>
        </div>

        {/* Background */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-primary/5" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-primary/5" />

        {/* Login Form */}
        <div className="relative z-10 w-full max-w-[430px]">{children}</div>
      </div>
    </div>
  );
}