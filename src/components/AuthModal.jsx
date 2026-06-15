"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { registerCustomer } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

// Input Component
const Input = ({ label, icon: Icon, type = "text", error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={inputType}
          className={`flex h-11 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500 focus-visible:border-transparent transition-all ${
            Icon ? "pl-10" : ""
          } ${isPassword ? "pr-10" : ""}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
    </div>
  );
};

// Checkbox Component
const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer group">
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <div className="w-5 h-5 border-2 border-slate-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all">
        <CheckCircle2 className="w-4 h-4 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" />
      </div>
    </div>
    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">
      {label}
    </span>
  </label>
);

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState({});

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    have_whatsapp: false,
    whatsapp_number: "",
  });
  const [registerErrors, setRegisterErrors] = useState({});

  // Animations
  useGSAP(
    () => {
      if (isOpen) {
        gsap.fromTo(
          ".modal-backdrop",
          { opacity: 0 },
          { opacity: 1, duration: 0.3 },
        );
        gsap.fromTo(
          ".modal-content",
          { scale: 0.9, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" },
        );
      }
    },
    { scope: modalRef, dependencies: [isOpen] },
  );

  const handleClose = () => {
    gsap.to(".modal-content", {
      scale: 0.9,
      opacity: 0,
      y: 20,
      duration: 0.2,
      onComplete: onClose,
    });
    gsap.to(".modal-backdrop", { opacity: 0, duration: 0.2 });
  };

  // Login handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (loginErrors[name]) {
      setLoginErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateLogin = () => {
    const errors = {};
    if (!loginData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.email = "Email is invalid";
    }
    if (!loginData.password) {
      errors.password = "Password is required";
    }
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: loginData.email,
        password: loginData.password,
        redirect: false,
      });

      if (result?.error) {
        try {
          const customError = JSON.parse(result.error);
          if (customError.type === "UNVERIFIED_EMAIL") {
            toast.error("Please verify your email before logging in");
          } else {
            toast.error(customError.message || "Login failed");
          }
        } catch {
          toast.error(result.error || "Invalid credentials");
        }
      } else if (result?.ok) {
        toast.success("Login successful!");
        handleClose();
        if (onSuccess) {
          onSuccess();
        } else {
          const redirectTo = searchParams.get("redirect");
          if (redirectTo) {
            router.push(redirectTo);
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  // Register handlers
  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (registerErrors[name]) {
      setRegisterErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleWhatsAppToggle = (e) => {
    const checked = e.target.checked;
    setRegisterData((prev) => ({
      ...prev,
      have_whatsapp: checked,
      whatsapp_number: checked ? prev.phone : "",
    }));
  };

  const validateRegister = () => {
    const errors = {};
    if (!registerData.name) errors.name = "Name is required";
    if (!registerData.username) errors.username = "Username is required";
    if (!registerData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      errors.email = "Email is invalid";
    }
    if (!registerData.password) {
      errors.password = "Password is required";
    } else if (registerData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (registerData.password !== registerData.password_confirmation) {
      errors.password_confirmation = "Passwords do not match";
    }
    if (!registerData.phone) errors.phone = "Phone is required";

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setIsLoading(true);
    try {
      const response = await registerCustomer(registerData);

      if (response.success) {
        toast.success("Account created successfully!", {
          description:
            "Please check your email to verify your account before logging in.",
          duration: 10000,
        });

        // Switch back to login tab
        setActiveTab("login");

        // Clear password fields for security
        setRegisterData((prev) => ({
          ...prev,
          password: "",
          password_confirmation: "",
        }));
      }
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="modal-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="modal-content relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {activeTab === "login"
              ? "Login to continue with your checkout"
              : "Register to complete your purchase"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800 px-6">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === "login"
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Login
            {activeTab === "login" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === "register"
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Register
            {activeTab === "register" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
        </div>

        {/* Forms */}
        <div className="p-6">
          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email"
                name="email"
                type="email"
                icon={Mail}
                placeholder="your@email.com"
                value={loginData.email}
                onChange={handleLoginChange}
                error={loginErrors.email}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={loginData.password}
                onChange={handleLoginChange}
                error={loginErrors.password}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Personal Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Personal Information
                </h3>
                <Input
                  label="Full Name"
                  name="name"
                  icon={User}
                  placeholder="John Doe"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  error={registerErrors.name}
                />
                <Input
                  label="Username"
                  name="username"
                  icon={User}
                  placeholder="johndoe123"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  error={registerErrors.username}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  icon={Mail}
                  placeholder="your@email.com"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  error={registerErrors.email}
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  error={registerErrors.password}
                />
                <Input
                  label="Confirm Password"
                  name="password_confirmation"
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                  value={registerData.password_confirmation}
                  onChange={handleRegisterChange}
                  error={registerErrors.password_confirmation}
                />
              </div>

              {/* Contact Info */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Contact Details
                </h3>
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  icon={Phone}
                  placeholder="+94771234567"
                  value={registerData.phone}
                  onChange={handleRegisterChange}
                  error={registerErrors.phone}
                />
                <Checkbox
                  label="I have WhatsApp on this number"
                  checked={registerData.have_whatsapp}
                  onChange={handleWhatsAppToggle}
                />
                {registerData.have_whatsapp && (
                  <Input
                    label="WhatsApp Number"
                    name="whatsapp_number"
                    type="tel"
                    icon={Phone}
                    placeholder="+94771234567"
                    value={registerData.whatsapp_number}
                    onChange={handleRegisterChange}
                    disabled
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
