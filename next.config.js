/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  allowedDevOrigins: [
    '*.preview.emergentagent.com',
    '*.preview.emergentcf.cloud',
    '*.cluster-12.preview.emergentcf.cloud',
  ],
  async redirects() {
    return [
      {
        source: '/store',
        destination: '/products',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
