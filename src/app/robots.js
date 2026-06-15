export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://foreign-emporium-frontend.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account/", "/checkout/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
