"use client";

import React, { useState, Suspense, useCallback, memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Calendar, Loader2, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import * as z from "zod";

const registerLocalSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  location: z.string().optional(),
  weddingDate: z.string().optional(),
  role: z.enum(["planning", "guest"]),
});

const RegisterFormInner = memo(function RegisterFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerLocalSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      location: "",
      weddingDate: "",
      role: "planning",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = useCallback(async (data) => {
    setIsLoading(true);

    try {
      const payload = {
        name: data.name,
        username: data.email.split("@")[0] + Math.floor(Math.random() * 1000),
        email: data.email,
        password: data.password,
        password_confirmation: data.password,
        meta: {
          location: data.location,
          weddingDate: data.weddingDate,
          role: data.role
        }
      };

      const response = await fetch(`${API_BASE_URL}/customer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error("Registration failed", { description: result.message || "Invalid input data." });
        return;
      }

      toast.success("Account created successfully!");
      if (result.token) localStorage.setItem("auth_token", result.token);
      
      const redirectTo = searchParams.get("redirect") || "/login";
      router.push(redirectTo);
    } catch (error) {
      toast.error("An unexpected error occurred", {
        description: "Please check your internet connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [router, searchParams]);

  const handleGoogleLogin = useCallback(() => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1'}/auth/google`;
  }, []);

  const handleFacebookLogin = useCallback(() => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1'}/auth/facebook`;
  }, []);

  return (
    <div className="w-full max-w-[480px] animate-fade-in-up relative z-20">
      {/* Back to Home */}
      <Link 
        href="/" 
        className="absolute -top-12 left-0 flex items-center gap-2 text-[12px] font-medium text-white/70 hover:text-white tracking-widest uppercase transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Home
      </Link>

      <div className="backdrop-blur-xl bg-black/30 border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle top glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        {/* Header Text */}
        <div className="mb-8 text-center animate-fade-in-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
          <h2 className="text-[28px] font-serif font-bold text-white mb-2 tracking-wide">
            Ceylon Weddings
          </h2>
          <p className="text-white/60 text-[14px] font-light">
            Create your account
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* First and Last Name */}
          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
            <label className="block text-[11px] font-bold text-[#d4b986] tracking-widest uppercase">
              Full Name
            </label>
            <div className="relative group flex items-center">
              <User className="absolute left-0 text-white/40 group-focus-within:text-[#d4b986] w-5 h-5 transition-colors" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Marcus Elegance"
                className={`w-full bg-transparent border-b ${
                  errors.name ? "border-red-400" : "border-white/20"
                } focus:outline-none focus:border-[#d4b986] pb-2 pt-1 pl-8 text-white text-[15px] placeholder:text-white/30 transition-colors`}
                {...register("name")}
              />
              {errors.name && <p className="text-red-400/90 text-xs mt-1 absolute -bottom-5">{errors.name.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
            <label className="block text-[11px] font-bold text-[#d4b986] tracking-widest uppercase">
              Email Address
            </label>
            <div className="relative group flex items-center">
              <Mail className="absolute left-0 text-white/40 group-focus-within:text-[#d4b986] w-5 h-5 transition-colors" strokeWidth={1.5} />
              <input
                type="email"
                placeholder="marcus@elegance.com"
                className={`w-full bg-transparent border-b ${
                  errors.email ? "border-red-400" : "border-white/20"
                } focus:outline-none focus:border-[#d4b986] pb-2 pt-1 pl-8 text-white text-[15px] placeholder:text-white/30 transition-colors`}
                {...register("email")}
              />
              {errors.email && <p className="text-red-400/90 text-xs mt-1 absolute -bottom-5">{errors.email.message}</p>}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "250ms", animationFillMode: "both" }}>
            <label className="block text-[11px] font-bold text-[#d4b986] tracking-widest uppercase">
              Password
            </label>
            <div className="relative group flex items-center">
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full bg-transparent border-b ${
                  errors.password ? "border-red-400" : "border-white/20"
                } focus:outline-none focus:border-[#d4b986] pb-2 pt-1 text-white text-[15px] placeholder:text-white/30 transition-colors`}
                {...register("password")}
              />
              {errors.password && <p className="text-red-400/90 text-xs mt-1 absolute -bottom-5">{errors.password.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
            {/* Getting Married In */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#d4b986] tracking-widest uppercase">
                Location
              </label>
              <div className="relative group flex items-center">
                <input
                  type="text"
                  placeholder="Colombo..."
                  className={`w-full bg-transparent border-b ${
                    errors.location ? "border-red-400" : "border-white/20"
                  } focus:outline-none focus:border-[#d4b986] pb-2 pt-1 text-white text-[15px] placeholder:text-white/30 transition-colors`}
                  {...register("location")}
                />
              </div>
            </div>

            {/* Wedding Date */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#d4b986] tracking-widest uppercase">
                Date
              </label>
              <div className="relative group flex items-center">
                <Calendar className="absolute left-0 text-white/40 group-focus-within:text-[#d4b986] w-5 h-5 z-0 transition-colors" strokeWidth={1.5} />
                <input
                  type="date"
                  className={`w-full bg-transparent border-b ${
                    errors.weddingDate ? "border-red-400" : "border-white/20"
                  } focus:outline-none focus:border-[#d4b986] pb-2 pt-1 pl-8 text-white text-[15px] placeholder:text-white/30 transition-colors [&::-webkit-calendar-picker-indicator]:opacity-0 relative z-10`}
                  {...register("weddingDate")}
                />
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="flex flex-col gap-3 pt-2 animate-fade-in-up" style={{ animationDelay: "350ms", animationFillMode: "both" }}>
            <span className="block text-[11px] font-bold text-[#d4b986] tracking-widest uppercase">I am</span>
            
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                  selectedRole === "planning" ? "border-[#d4b986]" : "border-white/30 group-hover:border-white/60"
                }`}>
                  {selectedRole === "planning" && <div className="w-2 h-2 rounded-full bg-[#d4b986]" />}
                </div>
                <input 
                  type="radio" 
                  value="planning" 
                  className="hidden" 
                  {...register("role")}
                />
                <span className="text-[13px] text-white/80">Planning my wedding</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                  selectedRole === "guest" ? "border-[#d4b986]" : "border-white/30 group-hover:border-white/60"
                }`}>
                  {selectedRole === "guest" && <div className="w-2 h-2 rounded-full bg-[#d4b986]" />}
                </div>
                <input 
                  type="radio" 
                  value="guest" 
                  className="hidden" 
                  {...register("role")}
                />
                <span className="text-[13px] text-white/80">Wedding guest</span>
              </label>
            </div>
          </div>

          {/* Terms Text */}
          <div className="pt-2 animate-fade-in-up" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
            <p className="text-[12px] text-white/50 leading-relaxed">
              By clicking 'Sign up', I agree to Ceylon Weddings{" "}
              <Link href="/privacy" className="font-semibold text-white/80 hover:text-white transition-colors">Privacy Policy</Link>
              {" "}and{" "}
              <Link href="/terms" className="font-semibold text-white/80 hover:text-white transition-colors">Terms of use</Link>
            </p>
          </div>

          {/* Submit Button */}
          <div className="animate-fade-in-up" style={{ animationDelay: "450ms", animationFillMode: "both" }}>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#d4b986] to-[#b89a61] hover:from-[#e6d0a7] hover:to-[#c4a66e] text-[#1a120e] font-bold h-[52px] rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(212,185,134,0.2)] hover:shadow-[0_0_30px_rgba(212,185,134,0.4)] uppercase tracking-widest text-[13px] disabled:opacity-70 mt-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6 animate-fade-in-up" style={{ animationDelay: "500ms", animationFillMode: "both" }}>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative px-4 text-[10px] font-medium text-white/40 tracking-widest uppercase bg-transparent backdrop-blur-sm">
            Or continue with
          </span>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: "550ms", animationFillMode: "both" }}>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 py-3 px-4 border border-white/10 hover:border-white/30 hover:bg-white/5 rounded-xl transition-all text-white text-[13px] font-medium backdrop-blur-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
              <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
              <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
              <path d="M5.26498 14.2949C5.02498 13.5699 4.875 12.8 4.875 12C4.875 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 12C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
              <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
            </svg>
            Google
          </button>
          
          <button
            type="button"
            onClick={handleFacebookLogin}
            className="flex items-center justify-center gap-3 py-3 px-4 border border-white/10 hover:border-white/30 hover:bg-white/5 rounded-xl transition-all text-white text-[13px] font-medium backdrop-blur-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#1877F2]" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pt-6 border-t border-white/5 animate-fade-in-up" style={{ animationDelay: "600ms", animationFillMode: "both" }}>
          <p className="text-[13px] text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#d4b986] hover:text-white transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
});

export function RegisterForm() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin w-8 h-8 text-[#d4b986]" />
        </div>
      }
    >
      <RegisterFormInner />
    </Suspense>
  );
}
