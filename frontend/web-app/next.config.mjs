/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: { serverActions: true },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.pixabay.com" },{ protocol: "https", hostname: "upload.wikimedia.org" }],
  },
};

export default nextConfig;
