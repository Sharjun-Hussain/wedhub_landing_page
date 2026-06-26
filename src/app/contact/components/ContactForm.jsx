"use client";

import React, { useRef, useState, useCallback, memo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Mail, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitContact } from "@/lib/api";

const Input = memo(
  ({ label, className, icon: Icon, type = "text", error, ...props }) => {
    return (
      <div className="space-y-2 w-full relative">
        {label && (
          <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <div className="relative group">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 group-focus-within:text-[#a97d43] dark:group-focus-within:text-[#d4af37] transition-colors pointer-events-none">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            type={type}
            className={`flex h-12 w-full rounded-lg border border-[#e7e3d9] dark:border-[#352d28] bg-[#faf9f6]/95 dark:bg-[#130f0d]/95 px-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/20 focus-visible:border-[#d4af37] transition-all duration-200 ${Icon ? "pl-12" : ""
              } ${className} ${error ? "border-red-500 ring-1 ring-red-500" : ""}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 pl-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

const Textarea = memo(({ label, className, icon: Icon, error, ...props }) => {
  return (
    <div className="space-y-2 w-full relative">
      {label && (
        <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-4 text-slate-400 dark:text-zinc-500 group-focus-within:text-[#a97d43] dark:group-focus-within:text-[#d4af37] transition-colors pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <textarea
          className={`flex min-h-[120px] w-full rounded-lg border border-[#e7e3d9] dark:border-[#352d28] bg-[#faf9f6]/95 dark:bg-[#130f0d]/95 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/20 focus-visible:border-[#d4af37] transition-all duration-200 resize-y ${Icon ? "pl-12" : ""
            } ${className} ${error ? "border-red-500 ring-1 ring-red-500" : ""}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 pl-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

const ContactForm = memo(function ContactForm() {
  const containerRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      // Only run animations on desktop screens (>= 1024px)
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          ".form-panel",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  const sanitizeText = useCallback((text, maxLength = 200) => {
    if (typeof text !== "string") return "";

    // 1. Decode recursively to catch double-encoded or multiple-encoded payloads
    let decoded = text;
    let prev = "";
    let depth = 0;
    while (decoded !== prev && decoded.includes("%") && depth < 5) {
      prev = decoded;
      try {
        decoded = decodeURIComponent(decoded);
      } catch (e) {
        break;
      }
      depth++;
    }

    // 2. Remove angle brackets to prevent HTML/XML/SVG tag insertion
    let clean = decoded.replace(/[<>]/g, "");

    // 3. Remove javascript:, data:, vbscript: protocols and common XSS vectors case-insensitively
    clean = clean.replace(/(javascript|data|vbscript)\s*:/gi, "");
    clean = clean.replace(/\b(alert|prompt|confirm|eval|onload|onerror|onclick|onmouseover)\b/gi, "");

    // 4. Limit length
    if (clean.length > maxLength) {
      clean = clean.slice(0, maxLength);
    }
    return clean;
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      let cleanVal = value;
      if (name === "name" || name === "subject") {
        cleanVal = sanitizeText(value, 100);
      } else if (name === "email") {
        cleanVal = sanitizeText(value, 100).toLowerCase().replace(/\s/g, "");
      } else if (name === "phone") {
        cleanVal = sanitizeText(value, 20).replace(/[^\d+()\s-]/g, "");
      } else if (name === "message") {
        cleanVal = sanitizeText(value, 2000);
      }
      setFormData((prev) => ({ ...prev, [name]: cleanVal }));
      setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
    },
    [sanitizeText],
  );

  const validate = useCallback(() => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const trimmedName = formData.name.trim();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) {
      newErrors.name = "Please enter your full name";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!formData.email) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const trimmedPhone = formData.phone.trim();
    if (trimmedPhone && trimmedPhone.length < 9) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!trimmedSubject) {
      newErrors.subject = "Please provide a subject";
    } else if (trimmedSubject.length < 4) {
      newErrors.subject = "Subject must be at least 4 characters long";
    }

    if (!trimmedMessage) {
      newErrors.message = "Message content cannot be empty";
    } else if (trimmedMessage.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validate()) return;
      setIsLoading(true);
      try {
        const result = await submitContact(formData);
        if (result.success || result.status === "success") {
          toast.success(result.message || "Message sent!");
          setFormData({ name: "", email: "", subject: "", message: "" });
        } else {
          toast.error(result.message || "Failed to send");
        }
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validate],
  );

  return (
    <div
      ref={containerRef}
      className="form-panel bg-white dark:bg-[#1d1815] border border-[#e7e3d9]/60 dark:border-[#352d28]/60 rounded-xl py-6 px-4 md:p-12 shadow-sm lg:hover:shadow-xl lg:hover:border-[#d4af37]/20 transition-all duration-300 transform-gpu backface-hidden"
    >
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-serif font-black text-[#2c2520] dark:text-white mb-2 tracking-tight">
          Direct Messaging
        </h2>
        {/* Arabic luxury pattern separator */}
        <div className="flex items-center justify-center lg:justify-start gap-2 mb-4 text-[#d4af37] text-xs">
          <span>✦</span>
          <span className="w-8 h-[1px] bg-[#d4af37]/30"></span>
          <span>✦</span>
          <span className="w-8 h-[1px] bg-[#d4af37]/30"></span>
          <span>✦</span>
        </div>
        <p className="text-slate-500 dark:text-zinc-400 text-xs font-light leading-relaxed">
          Your data is secure and encrypted. Expect a reply within the same
          business day.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Full Name"
            name="name"
            placeholder="e.g. Ajm Afees"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="e.g. mim.insath007@gmail.com"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
        </div>

        <Input
          label="Phone Number (Optional)"
          name="phone"
          type="tel"
          placeholder="e.g. +94 77 000 0000"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />

        <Input
          label="Subject"
          name="subject"
          placeholder="Briefly describe your inquiry"
          value={formData.subject}
          onChange={handleChange}
          error={errors.subject}
        />

        <Textarea
          label="Message Description"
          name="message"
          placeholder="Tell us what you're looking for or how we can help..."
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
        />

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#d4af37] text-zinc-950 lg:hover:bg-[#a97d43] lg:hover:text-white lg:dark:hover:text-white font-black h-12 rounded-md flex items-center justify-center gap-3 transition-all active:scale-[0.97] group disabled:opacity-70 disabled:cursor-not-allowed uppercase text-[11px] tracking-[0.15em]"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Send Message
                <Send className="w-4 h-4 lg:group-hover:translate-x-1 lg:group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
});

ContactForm.displayName = "ContactForm";

export default ContactForm;
