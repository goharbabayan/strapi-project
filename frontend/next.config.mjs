/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['snlxdashboard.giesystems.com'], // Add 'localhost' to the allowed domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'snlxdashboard.giesystems.com', // Replace with your Strapi domain
        pathname: '/uploads/**', // Adjust if your image paths differ
      },
    ],
  },
};

export default nextConfig;
