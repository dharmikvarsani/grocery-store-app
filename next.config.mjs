/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "freshkart-admin.onrender.com", 
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
