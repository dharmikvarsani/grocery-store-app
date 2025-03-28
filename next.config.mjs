/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "grocery-store-admin.up.railway.app", 
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
