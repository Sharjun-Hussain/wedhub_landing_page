"use client";

import React, { useState, Suspense, useCallback, memo } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { sanitizeObject } from "@/lib/security";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

const ResetPasswordFormInner = memo(function ResetPasswordFormInner() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = useCallback(async (data) => {
    if (!token || !email) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }

    setIsLoading(true);

    try {
      const sanitizedData = sanitizeObject({
        ...data,
        email,
        token,
      });

      const response = await fetch(`${API_BASE_URL}/customer/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error("Reset failed", {
          description: result.message || "Unable to reset password.",
        });
        return;
      }

      setIsSubmitted(true);
      toast.success("Password reset successful!");
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [token, email]);

  return (
    <div className="w-full max-w-[480px] animate-fade-in-up relative z-20">
      {/* Back to Login - Top Right */}
      {!isSubmitted && (
        <Link 
          href="/login" 
          className="absolute -top-12 left-0 flex items-center gap-2 text-[12px] font-medium text-white/70 hover:text-white tracking-widest uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Login
        </Link>
      )}

      <div className="backdrop-blur-xl bg-black/30 border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle top glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        {!isSubmitted ? (
          <>
            <div className="mb-10 text-center animate-fade-in-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
              <h2 className="text-[28px] font-serif font-bold text-white mb-2 tracking-wide">
                Set New Password
              </h2>
              <p className="text-white/60 text-[14px] font-light">
                Your new password must be different from previously used passwords.
              </p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              {/* New Password */}
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
                <label className="block text-[11px] font-bold text-[#d4b986] tracking-widest uppercase">
                  Create new password
                </label>
                <div className="relative group flex items-center">
                  <Lock className="absolute left-0 text-white/40 group-focus-within:text-[#d4b986] w-5 h-5 transition-colors" strokeWidth={1.5} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full bg-transparent border-b ${
                      errors.password ? "border-red-400" : "border-white/20"
                    } focus:outline-none focus:border-[#d4b986] pb-2 pt-1 pl-8 text-white text-[15px] placeholder:text-white/30 transition-colors`}
                    {...register("password")}
                  />
                  {errors.password && <p className="text-red-400/90 text-xs mt-1 absolute -bottom-5">{errors.password.message}</p>}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
                <label className="block text-[11px] font-bold text-[#d4b986] tracking-widest uppercase">
                  Repeat new password
                </label>
                <div className="relative group flex items-center">
                  <Lock className="absolute left-0 text-white/40 group-focus-within:text-[#d4b986] w-5 h-5 transition-colors" strokeWidth={1.5} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full bg-transparent border-b ${
                      errors.password_confirmation ? "border-red-400" : "border-white/20"
                    } focus:outline-none focus:border-[#d4b986] pb-2 pt-1 pl-8 text-white text-[15px] placeholder:text-white/30 transition-colors`}
                    {...register("password_confirmation")}
                  />
                  {errors.password_confirmation && <p className="text-red-400/90 text-xs mt-1 absolute -bottom-5">{errors.password_confirmation.message}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="animate-fade-in-up" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#d4b986] to-[#b89a61] hover:from-[#e6d0a7] hover:to-[#c4a66e] text-[#1a120e] font-bold h-[52px] rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(212,185,134,0.2)] hover:shadow-[0_0_30px_rgba(212,185,134,0.4)] uppercase tracking-widest text-[13px] disabled:opacity-70 mt-4"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center space-y-6 animate-fade-in-up">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-fade-in-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
              <CheckCircle2 className="w-10 h-10 text-[#d4b986]" strokeWidth={1.5} />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
              <h2 className="text-[28px] font-serif font-bold text-white mb-2 tracking-wide">
                Password updated
              </h2>
              <p className="text-white/60 text-[14px] font-light mb-2">
                Your password has been successfully reset. Click below to log in securely.
              </p>
            </div>
            <div className="pt-8 animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
              <Link
                href="/login"
                className="w-full bg-gradient-to-r from-[#d4b986] to-[#b89a61] hover:from-[#e6d0a7] hover:to-[#c4a66e] text-[#1a120e] font-bold h-[52px] rounded-xl flex items-center justify-center transition-all shadow-[0_0_20px_rgba(212,185,134,0.2)] hover:shadow-[0_0_30px_rgba(212,185,134,0.4)] uppercase tracking-widest text-[13px]"
              >
                Continue to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin w-8 h-8 text-[#d4b986]" />
        </div>
      }
    >
      <ResetPasswordFormInner />
    </Suspense>
  );
}
