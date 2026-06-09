/** @type {import('next').NextConfig} */

// Host the company team uses in the browser for the admin (Sanity Studio).
const ADMIN_HOST = process.env.ADMIN_HOST || 'admin.foalandpony.com'

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp', 'image/avif'],
    unoptimized: false,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/**' },
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
    ],
  },

  /**
   * Admin subdomain rewrite.
   *
   * Requests hitting `admin.foalandpony.com/<anything>` are rewritten to
   * `/studio/<anything>` on the same Vercel project. Sanity Studio mounts at
   * `/studio` and handles its own auth via Sanity SSO.
   *
   * After deploy: add admin.foalandpony.com as a domain on the Vercel project.
   * No second host, no proxy origin, no extra DNS for the backend.
   */
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [{ type: 'host', value: ADMIN_HOST }],
          destination: '/studio',
        },
        {
          source: '/:path*',
          has: [{ type: 'host', value: ADMIN_HOST }],
          destination: '/studio/:path*',
        },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
}

module.exports = nextConfig
