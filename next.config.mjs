/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",   // Increase upload limit
    },
  },
};

export default nextConfig;
