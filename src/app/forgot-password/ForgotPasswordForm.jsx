"use client";

import React, { useState, useCallback, memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { sanitizeObject } from "@/lib/security";
import Link from "next/link";

export const ForgotPasswordForm = memo(function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = useCallback(async (data) => {
    setIsLoading(true);
    const sanitizedEmail = sanitizeObject(data).email;

    try {
      const { API_BASE_URL } = await import("@/lib/api");
      const { toast } = await import("sonner");

      const response = await fetch(`${API_BASE_URL}/customer/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sanitizedEmail }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors?.email) {
          setError("email", { message: result.errors.email[0] });
        } else {
          toast.error(result.message || "Failed to send reset link");
        }
        return;
      }

      setSubmittedEmail(sanitizedEmail);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      const { toast } = await import("sonner");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [setError]);

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
                Forgot Password
              </h2>
              <p className="text-white/60 text-[14px] font-light">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
                <label className="block text-[11px] font-bold text-[#d4b986] tracking-widest uppercase">
                  Email Address
                </label>
                <div className="relative group flex items-center">
                  <Mail className="absolute left-0 text-white/40 group-focus-within:text-[#d4b986] w-5 h-5 transition-colors" strokeWidth={1.5} />
                  <input
                    type="email"
                    placeholder="Email address"
                    className={`w-full bg-transparent border-b ${
                      errors.email ? "border-red-400" : "border-white/20"
                    } focus:outline-none focus:border-[#d4b986] pb-2 pt-1 pl-8 text-white text-[15px] placeholder:text-white/30 transition-colors`}
                    {...register("email")}
                  />
                  {errors.email && <p className="text-red-400/90 text-xs mt-1 absolute -bottom-5">{errors.email.message}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#d4b986] to-[#b89a61] hover:from-[#e6d0a7] hover:to-[#c4a66e] text-[#1a120e] font-bold h-[52px] rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(212,185,134,0.2)] hover:shadow-[0_0_30px_rgba(212,185,134,0.4)] uppercase tracking-widest text-[13px] disabled:opacity-70 mt-4"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
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
                Check your email
              </h2>
              <p className="text-white/60 text-[14px] font-light mb-2">
                We sent a password reset link to
              </p>
              <p className="font-bold text-[#d4b986] text-lg">
                {submittedEmail}
              </p>
            </div>
            <p className="text-[13px] text-white/40 mt-6 animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-[#d4b986] font-semibold hover:text-white transition-colors"
              >
                try again
              </button>
              .
            </p>
            <div className="pt-8 flex justify-center animate-fade-in-up" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-[12px] font-medium text-white/70 hover:text-white tracking-widest transition-colors uppercase"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
