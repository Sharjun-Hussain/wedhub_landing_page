import { z } from "zod";

// --- LOGIN SCHEMA ---
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

// --- FORGOT PASSWORD SCHEMA ---
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

// --- REGISTRATION SCHEMAS ---

// Step 1: Account Information
export const registerStep1Schema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name is too short")
      .max(100, "Name is too long"),
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9._]+$/,
        "Username can only contain letters, numbers, dots, and underscores",
      ),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

// Step 2: Contact Information
export const registerStep2Schema = z
  .object({
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^(\+\d{1,3}[- ]?)?\d{9,12}$/, "Invalid phone number format"),
    have_whatsapp: z.boolean().default(false),
    whatsapp_number: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.have_whatsapp &&
        (!data.whatsapp_number || data.whatsapp_number.length < 9)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "WhatsApp number is required when enabled",
      path: ["whatsapp_number"],
    },
  );

// Step 3: Terms & Final Review
export const registerStep3Schema = z.object({
  terms: z.boolean().refine((v) => v === true, {
    message: "You must accept the terms and conditions",
  }),
});

// Full Registration Schema (for final submission)
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name is too short")
      .max(100, "Name is too long"),
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9._]+$/,
        "Username can only contain letters, numbers, dots, and underscores",
      ),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^(\+\d{1,3}[- ]?)?\d{9,12}$/, "Invalid phone number format"),
    have_whatsapp: z.boolean().default(false),
    whatsapp_number: z.string().optional(),
    terms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  })
  .refine(
    (data) => {
      if (
        data.have_whatsapp &&
        (!data.whatsapp_number || data.whatsapp_number.length < 9)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "WhatsApp number is required when enabled",
      path: ["whatsapp_number"],
    },
  );
// --- RESET PASSWORD SCHEMA ---
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
