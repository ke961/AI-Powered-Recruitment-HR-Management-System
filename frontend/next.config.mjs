/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'storage.hireflow.ai', 'images.unsplash.com'],
  },
};

export default nextConfig;
