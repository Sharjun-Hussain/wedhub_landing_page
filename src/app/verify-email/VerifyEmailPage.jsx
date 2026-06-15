"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Mail,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { toast } from "sonner";
import { resendVerificationAction, verifyEmailAction } from "./actions";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthBranding } from "@/components/auth/AuthBranding";

const VerifyEmailContent = () => {
  const containerRef = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [isResending, setIsResending] = useState(false);
  const [resendErrors, setResendErrors] = useState({});

  // GSAP Animations
  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Panel Entrance
      tl.fromTo(
        ".left-panel",
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
      ).fromTo(
        ".right-panel",
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        "<",
      );

      // Content Stagger
      tl.fromTo(
        ".stagger-in",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, ease: "power2.out" },
        "-=0.4",
      );
    },
    { scope: containerRef },
  );

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      if (!email) {
        setStatus("error");
        setMessage("No verification token or email provided.");
      } else {
        setStatus("loading_info");
        setMessage(
          `Please check your email (${email}) for the verification link.`,
        );
      }
      return;
    }

    // Verify the email token
    const verifyEmail = async () => {
      try {
        const result = await verifyEmailAction(token);
        const { success, status: resStatus, data } = result;

        if (success && data.success) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");

          // Start countdown and redirect
          let timeLeft = 5;
          const countdownInterval = setInterval(() => {
            timeLeft -= 1;
            setCountdown(timeLeft);

            if (timeLeft <= 0) {
              clearInterval(countdownInterval);
              router.push("/login?verified=true");
            }
          }, 1000);
        } else if (data.message === "Email already verified.") {
          setStatus("success");
          setMessage(
            "Your account is already verified. Please login to your account.",
          );
          toast.success("Account already verified!", {
            description: "Please login to your account.",
            action: {
              label: "Login",
              onClick: () => router.push("/login"),
            },
          });

          let timeLeft = 5;
          const countdownInterval = setInterval(() => {
            timeLeft -= 1;
            setCountdown(timeLeft);

            if (timeLeft <= 0) {
              clearInterval(countdownInterval);
              router.push("/login");
            }
          }, 1000);
        } else {
          setStatus("error");
          setMessage(data.message || "Invalid verification token.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred during verification. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  const handleResend = async (e) => {
    if (e) e.preventDefault();
    setResendErrors({});

    if (!email.trim()) {
      setResendErrors({ email: ["Please enter your email address."] });
      return;
    }

    setIsResending(true);

    try {
      const result = await resendVerificationAction(email);
      const { success, status: resStatus, data } = result;

      if (success) {
        toast.success("Request processed", {
          description:
            "If an account is found with this email, we will send you a verification link.",
        });
      } else if (resStatus === 422 && data.errors) {
        setResendErrors(data.errors);
        toast.error(data.message || "Validation failed");
      } else if (data.message === "Email already verified.") {
        toast.info("Account already verified!", {
          description: "Your account is already verified. Please login.",
          action: {
            label: "Login",
            onClick: () => router.push("/login"),
          },
        });
        setStatus("success");
        setMessage(
          "Your account is already verified. Please login to your account.",
        );
      } else if (resStatus === 404) {
        // Mask 404 to prevent account enumeration
        toast.success("Request processed", {
          description:
            "If an account is found with this email, we will send you a verification link.",
        });
      } else {
        toast.error("Failed to resend email", {
          description: "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col lg:flex-row bg-[#faf9f6] dark:bg-[#130f0d] overflow-x-hidden font-sans transition-colors duration-300"
    >
      {/* --- LEFT PANEL: BRANDING --- */}
      <AuthBranding title="Secure Email Verification" />

      {/* --- RIGHT PANEL: VERIFICATION CONTENT --- */}
      <div className="right-panel w-full lg:w-[55%] p-8 lg:p-16 flex flex-col justify-center items-center bg-white dark:bg-[#0f0b0a] transition-colors duration-300 relative min-h-screen overflow-hidden">
        {/* Modern Dotted Architectural Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#a97d43_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0" />

        {/* Drifting Liquid Blobs */}
        <div className="absolute top-[15%] right-[-15%] w-[450px] h-[450px] rounded-full bg-[#a97d43]/10 dark:bg-[#d4af37]/5 blur-[100px] filter animate-blob pointer-events-none z-0" />
        <div className="absolute bottom-[15%] left-[-15%] w-[450px] h-[450px] rounded-full bg-[#991b1b]/5 dark:bg-[#b89569]/4 blur-[100px] filter animate-blob animation-delay-2000 pointer-events-none z-0" />

        <AuthHeader />
        <div className="max-w-md w-full pt-4 lg:pt-0 relative z-10">
          {/* Status Content */}
          <div className="stagger-in text-center lg:text-left">
            {status === "loading" && (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-[#f5f3ef] dark:bg-[#1d1815] rounded-3xl flex items-center justify-center mx-auto lg:mx-0 border border-[#e7e3d9] dark:border-[#352d28]">
                  <Loader2 className="w-10 h-10 text-[#a97d43] dark:text-[#d4af37] animate-spin" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif tracking-wide">
                    Verifying your email
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Please wait while we validate your credentials.
                  </p>
                </div>
              </div>
            )}

            {status === "loading_info" && (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-[#f5f3ef] dark:bg-[#1d1815] rounded-3xl flex items-center justify-center mx-auto lg:mx-0 border border-[#e7e3d9] dark:border-[#352d28]">
                  <Mail className="w-10 h-10 text-[#a97d43] dark:text-[#d4af37] animate-pulse" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif tracking-wide">
                    Check your inbox
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    {message}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#faf9f6] dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28]">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    We've sent a secure link to verify your identity. It may
                    take a minute to arrive.
                  </p>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-3xl flex items-center justify-center mx-auto lg:mx-0">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif tracking-wide">
                    Verification successful!
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    {message}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                    Redirecting to login in{" "}
                    <span className="font-bold">{countdown}s</span>. You can now
                    access your full profile.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/login?verified=true")}
                  className="w-full bg-[#a97d43] hover:bg-[#8a6331] dark:bg-[#d4af37] dark:hover:bg-[#b89569] text-zinc-950 font-bold h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-slate-200 dark:shadow-none transition-all active:scale-[0.98] group"
                >
                  Go to Login Now
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-3xl flex items-center justify-center mx-auto lg:mx-0 border border-red-200 dark:border-red-800">
                  <XCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif tracking-wide">
                    Verification failed
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    {message}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                    The link might have expired or is incorrect. Please request
                    a new one below.
                  </p>
                </div>
              </div>
            )}

            {/* Resend Section */}
            {(status === "error" || status === "loading_info") && (
              <div className="mt-10 space-y-5 stagger-in">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 group-focus-within:text-[#a97d43] dark:group-focus-within:text-[#d4af37] transition-colors pointer-events-none">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`flex h-12 w-full rounded-2xl border bg-white dark:bg-zinc-900 pl-12 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a97d43] dark:focus-visible:ring-[#d4af37] focus-visible:border-transparent transition-all duration-200 ${
                      resendErrors.email
                        ? "border-red-500"
                        : "border-slate-200 dark:border-zinc-800"
                    }`}
                  />
                  {resendErrors.email && (
                    <p className="text-xs text-red-500 mt-1.5 pl-1 animate-in fade-in slide-in-from-top-1">
                      {resendErrors.email[0]}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="w-full bg-[#a97d43] hover:bg-[#8a6331] dark:bg-[#d4af37] dark:hover:bg-[#b89569] text-zinc-950 font-bold h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-slate-200 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isResending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                  Resend Verification Email
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="w-full bg-transparent text-slate-600 dark:text-slate-400 font-bold h-12 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all active:scale-[0.98] border border-transparent hover:border-[#e7e3d9] dark:hover:border-[#352d28]"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const VerifyEmailPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 p-4">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Initializing secure environment...
            </p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmailPage;
