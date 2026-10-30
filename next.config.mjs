/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone helps easy deployment in cPanel Node.js or Docker/VPS
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },
};

export default nextConfig;
