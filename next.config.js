
// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Keeping this minimal for debugging the loading issue */
  // reactStrictMode: true, // Can be enabled later
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos', // Added for consistency if it was used elsewhere
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    // If you have TypeScript errors that are not critical for deployment,
    // you can enable this, but it's better to fix them.
    // ignoreBuildErrors: true,
  },
  eslint: {
    // If ESLint errors are blocking builds unnecessarily.
    // ignoreDuringBuilds: true,
  },
};

export default nextConfig;
