/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.foreignemporium.lk",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com data:",
              "img-src 'self' data: blob: http://localhost:5000 https://fe.inzeedo.lk https://api.foreignemporium.lk https://images.unsplash.com https://images.pexels.com https://via.placeholder.com https://cdn.simpleicons.org https://www.gstatic.com",
              "connect-src 'self' http://localhost:5000 https://fe.inzeedo.lk https://api.foreignemporium.lk",
              "frame-src 'self' https://maps.google.com https://www.google.com",
              "frame-ancestors 'self'",
              "object-src 'self'",
            ].join("; "),
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  images: {
    unoptimized: true,
    domains: ["images.unsplash.com", "localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.gstatic.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fe.inzeedo.lk",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.foreignemporium.lk",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
