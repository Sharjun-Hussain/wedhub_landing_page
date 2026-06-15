"use client";

import React, { useState } from "react";
import { User, Camera, Settings, Phone, Mail, Loader2 } from "lucide-react";
import { AuthInput } from "@/components/auth/AuthInput";
import { useSession } from "next-auth/react";
import { updateUserProfile } from "@/lib/api";
import { toast } from "sonner";

export const ProfileTab = ({ profile: initialProfile }) => {
  const { data: session, update: updateSession } = useSession();
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: initialProfile?.name?.split(" ")[0] || "",
    lastName: initialProfile?.name?.split(" ").slice(1).join(" ") || "",
    email: initialProfile?.email || "",
    phone: initialProfile?.phone || initialProfile?.customer_profile?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!session?.accessToken) {
      toast.error("Please login to save your profile changes.");
      return;
    }

    const name = `${formData.firstName} ${formData.lastName}`.trim();
    if (!name) {
      toast.error("Name cannot be empty.");
      return;
    }

    if (!formData.email) {
      toast.error("Email cannot be empty.");
      return;
    }

    setIsSaving(true);
    const savePromise = new Promise(async (resolve, reject) => {
      try {
        const payload = {
          name,
          email: formData.email,
          phone: formData.phone,
        };

        if (showPasswordSection && formData.newPassword) {
          if (formData.newPassword !== formData.confirmPassword) {
            throw new Error("New password and confirm password do not match.");
          }
          payload.password = formData.newPassword;
        }

        const res = await updateUserProfile(payload, session.accessToken);

        if (res.success) {
          // Update local profile state
          setProfile((prev) => ({
            ...prev,
            name,
            email: formData.email,
            phone: formData.phone,
          }));

          // Trigger next-auth session token updates
          await updateSession({
            ...session,
            user: {
              ...session.user,
              name,
              email: formData.email,
            },
          });

          setIsEditing(false);
          setShowPasswordSection(false);
          setFormData((prev) => ({
            ...prev,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }));

          resolve("Profile updated successfully!");
        } else {
          reject(new Error(res.message || "Failed to update profile."));
        }
      } catch (err) {
        reject(err);
      } finally {
        setIsSaving(false);
      }
    });

    toast.promise(savePromise, {
      loading: "Saving your profile...",
      success: (data) => data,
      error: (err) => err.message || "Something went wrong.",
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative group cursor-pointer shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#a97d43] dark:bg-[#d4af37] border-4 border-white dark:border-zinc-900 shadow-lg overflow-hidden flex items-center justify-center">
              {profile?.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl sm:text-3xl font-black text-white dark:text-[#130f0d] tracking-widest">
                  {getInitials(profile?.name)}
                </span>
              )}
            </div>
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white line-clamp-1">
              {profile?.name || "User"}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400">
              Member since{" "}
              {profile?.created_at
                ? new Date(profile.created_at).getFullYear()
                : "2026"}
            </p>
          </div>
        </div>

        {!isEditing && !showPasswordSection && (
          <div className="flex gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 sm:flex-none px-6 py-3 bg-[#a97d43]/10 dark:bg-[#d4af37]/10 rounded-2xl text-xs sm:text-sm font-black text-[#a97d43] dark:text-[#d4af37] hover:bg-[#a97d43]/20 dark:hover:bg-[#d4af37]/20 transition-all border border-[#a97d43]/20 dark:border-[#d4af37]/20 shadow-sm"
            >
              Update Profile
            </button>
            <button
              onClick={() => {
                setIsEditing(true);
                setShowPasswordSection(true);
              }}
              className="flex-1 sm:flex-none px-6 py-3 bg-slate-50 dark:bg-[#2d2520] rounded-2xl text-xs sm:text-sm font-black text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#352d28] transition-all border border-[#e7e3d9] dark:border-[#352d28] shadow-sm"
            >
              Update Password
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AuthInput
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            icon={User}
            readOnly={!isEditing}
            className={
              !isEditing
                ? "bg-white dark:bg-zinc-900/50 cursor-default opacity-80 border-[#e7e3d9] dark:border-[#352d28]"
                : "focus:border-[#a97d43] dark:focus:border-[#d4af37]"
            }
          />
          <AuthInput
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            icon={User}
            readOnly={!isEditing}
            className={
              !isEditing
                ? "bg-white dark:bg-zinc-900/50 cursor-default opacity-80 border-[#e7e3d9] dark:border-[#352d28]"
                : "focus:border-[#a97d43] dark:focus:border-[#d4af37]"
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AuthInput
            label="Email Address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            type="email"
            icon={Mail}
            readOnly={!isEditing}
            className={
              !isEditing
                ? "bg-white dark:bg-zinc-900/50 cursor-default opacity-80 border-[#e7e3d9] dark:border-[#352d28]"
                : "focus:border-[#a97d43] dark:focus:border-[#d4af37]"
            }
          />
          <AuthInput
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            type="tel"
            icon={Phone}
            readOnly={!isEditing}
            className={
              !isEditing
                ? "bg-white dark:bg-zinc-900/50 cursor-default opacity-80 border-[#e7e3d9] dark:border-[#352d28]"
                : "focus:border-[#a97d43] dark:focus:border-[#d4af37]"
            }
          />
        </div>

        {showPasswordSection && (
          <div className="pt-6 border-t border-[#e7e3d9] dark:border-[#352d28] animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Change Password
            </h3>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AuthInput
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange("newPassword", e.target.value)}
                />
                <AuthInput
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="pt-6 border-t border-[#e7e3d9] dark:border-[#352d28] flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 sm:flex-none px-10 bg-[#a97d43] dark:bg-[#d4af37] text-white dark:text-[#130f0d] hover:bg-[#976d38] dark:hover:bg-[#c29e2c] font-black h-12 rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-[#a97d43]/20 dark:shadow-[#d4af37]/20 uppercase tracking-wide text-xs flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setShowPasswordSection(false);
                setFormData({
                  firstName: profile?.name?.split(" ")[0] || "",
                  lastName: profile?.name?.split(" ").slice(1).join(" ") || "",
                  email: profile?.email || "",
                  phone: profile?.phone || profile?.customer_profile?.phone || "",
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
              className="flex-1 sm:flex-none px-10 bg-slate-100 dark:bg-[#2d2520] text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-[#352d28] font-black h-12 rounded-2xl transition-all active:scale-[0.98] uppercase tracking-wide text-xs"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
