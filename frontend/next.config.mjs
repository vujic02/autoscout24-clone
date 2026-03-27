/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // your Django backend domain
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      // any existing domains
      {
        protocol: "https",
        hostname: "flagsapi.com",
      },
    ],
  },
};

export default nextConfig;
