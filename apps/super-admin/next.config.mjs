/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "res.cloudinary.com", "images.unsplash.com", "plus.unsplash.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: "https://api.lfvs.in/:path*",
      },
    ];
  },

};

export default nextConfig;
