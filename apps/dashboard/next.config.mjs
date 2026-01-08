/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
  // Disable Fast Refresh
  experimental: {
    optimizeCss: false,
  },
  // Prevent file watching issues
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Disable HMR overlay
      config.devtool = false;
      // Ignore watching certain directories
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      };
    }
    return config;
  },
};

export default nextConfig;
