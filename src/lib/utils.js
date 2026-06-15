import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateHypeParams() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const randomStr = (len) =>
    Array.from(
      { length: len },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");

  const params = {
    ref: `ps_dp_ov_d_t1_${randomStr(8)}`,
    _encoding: "UTF8",
    pf_rd_p: `${randomStr(8)}-${randomStr(4)}-${randomStr(4)}-${randomStr(4)}-${randomStr(12)}`,
    pf_rd_r: randomStr(20).toUpperCase(),
    pd_rd_wg: randomStr(5),
    pd_rd_r: `${randomStr(8)}-${randomStr(4)}-${randomStr(4)}-${randomStr(4)}-${randomStr(12)}`,
    pd_rd_w: randomStr(5),
    content_id: `amzn1.sym.${randomStr(8)}-${randomStr(4)}-${randomStr(4)}-${randomStr(4)}-${randomStr(12)}`,
    marketplaceID: "A2EUQ1WTGCTBG2",
    sessionID: `${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 9999999)}-${Math.floor(Math.random() * 9999999)}`,
  };

  return Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
}

export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return "Rs. 0";
  return "Rs. " + Number(amount).toLocaleString("en-LK");
}

export function getColorHex(colorName) {
  if (!colorName) return null;

  // If it's already a hex code, return it
  if (colorName.startsWith("#")) return colorName;

  const colors = {
    // Basic Colors
    white: "#FFFFFF",
    black: "#000000",
    red: "#FF0000",
    blue: "#0000FF",
    green: "#008000",
    yellow: "#FFFF00",
    grey: "#808080",
    gray: "#808080",
    purple: "#800080",
    orange: "#FFA500",
    pink: "#FFC0CB",
    gold: "#FFD700",
    silver: "#C0C0C0",

    // Tech Specific Colors
    "space gray": "#535150",
    midnight: "#191970",
    starlight: "#F1F1E6",
    "midnight blue": "#191970",
    graphite: "#41424C",
    "pacific blue": "#2E5E64",
    "sierra blue": "#9BB5CE",
    "alpine green": "#505E4C",
    "rose gold": "#B76E79",
    "sky blue": "#87CEEB",
    "titanium gray": "#8B8989",
  };

  const normalized = colorName.toLowerCase().trim();
  return colors[normalized] || null;
}

export function normalizeImageUrl(path, apiBaseUrl) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const baseUrl = (apiBaseUrl || "https://fe.inzeedo.lk/api/v1").replace(
    "/api/v1",
    "",
  );
  const cleanPath = path.replace(/\/+/g, "/");
  return `${baseUrl}/${cleanPath.startsWith("/") ? cleanPath.slice(1) : cleanPath}`;
}
