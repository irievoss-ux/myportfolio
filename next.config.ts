/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000', 
        '*.github.dev' // This allows your GitHub Codespace to use Server Actions
      ],
    },
  },
};

export default nextConfig;