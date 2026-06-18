"use client";

import React, { useState, useCallback, memo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, LogIn, Mail, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { loginSchema } from "@/lib/validations/auth";
import { sanitizeObject } from "@/lib/security";

export const LoginForm = memo(function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = useCallback(async (data) => {
    setIsLoading(true);
    const sanitizedData = sanitizeObject(data);

    try {
      const result = await signIn("credentials", {
        email: sanitizedData.email,
        password: sanitizedData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Login failed", {
          description: result.error || "Invalid email or password.",
        });
      } else if (result?.ok) {
        toast.success("Login successful!", {
          description: "Welcome back to WedHub.",
        });
        const redirectTo = searchParams.get("redirect") || "/";
        router.push(redirectTo);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
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

        {/* Header Texts */}
        <div className="mb-10 text-center animate-fade-in-up flex flex-col items-center" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
          <Image
            src="/logo.png"
            alt="WedHub Logo"
            width={180}
            height={60}
            className="mb-4 object-contain brightness-0 invert opacity-90 drop-shadow-md"
            priority
          />
          <p className="text-white/60 text-[14px] font-light mt-2">
            Sign in to continue your journey
          </p>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
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

        {/* Divider */}
        <div className="relative flex items-center justify-center my-8 animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative px-4 text-[10px] font-medium text-white/40 tracking-widest uppercase bg-transparent backdrop-blur-sm">
            Or continue with email
          </span>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
            <label className="block text-[11px] font-bold text-[#fc0a7a] tracking-widest uppercase">
              Email Address
            </label>
            <div className="relative group flex items-center">
              <Mail className="absolute left-0 text-white/40 group-focus-within:text-[#fc0a7a] w-5 h-5 transition-colors" strokeWidth={1.5} />
              <input
                type="email"
                placeholder="marcus@elegance.com"
                className={`w-full bg-transparent border-b ${
                  errors.email ? "border-red-400" : "border-white/20"
                } focus:outline-none focus:border-[#fc0a7a] pb-2 pt-1 pl-8 text-white text-[15px] placeholder:text-white/30 transition-colors`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-400/90 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-[#fc0a7a] tracking-widest uppercase">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] text-white/50 hover:text-white transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative group flex items-center">
              <Lock className="absolute left-0 text-white/40 group-focus-within:text-[#fc0a7a] w-5 h-5 transition-colors" strokeWidth={1.5} />
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full bg-transparent border-b ${
                  errors.password ? "border-red-400" : "border-white/20"
                } focus:outline-none focus:border-[#fc0a7a] pb-2 pt-1 pl-8 text-white text-[15px] placeholder:text-white/30 transition-colors`}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-red-400/90 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="animate-fade-in-up" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#fc0a7a] to-[#d60866] hover:from-[#ff1f8b] hover:to-[#fc0a7a] text-white font-bold h-[52px] rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(252,10,122,0.3)] hover:shadow-[0_0_30px_rgba(252,10,122,0.5)] uppercase tracking-widest text-[13px] disabled:opacity-70 mt-4"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <span>Sign In</span>
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-white/5 animate-fade-in-up" style={{ animationDelay: "700ms", animationFillMode: "both" }}>
          <p className="text-[13px] text-white/60">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-[#fc0a7a] hover:text-[#ff1f8b] transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
});

