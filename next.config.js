/** @type {import('next').NextConfig} */

// Origin where the Medusa admin + API live (on Render).
// In dev this can be http://localhost:9000. In production it's your Render URL.
const ADMIN_ORIGIN =
  process.env.ADMIN_ORIGIN ||
  process.env.MEDUSA_BACKEND_URL ||
  'http://localhost:9000'

// Host that the company will use in the browser, e.g. admin.foalandpony.com
const ADMIN_HOST = process.env.ADMIN_HOST || 'admin.foalandpony.com'

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp', 'image/avif'],
    unoptimized: false,
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '9000', pathname: '/**' },
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: '**.r2.dev', pathname: '/**' },
      { protocol: 'https', hostname: '**.onrender.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.amazonaws.com', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'medusa-public-images.s3.eu-west-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },

  /**
   * Admin subdomain proxy.
   *
   * Requests hitting `admin.foalandpony.com/<anything>` are proxied to the
   * Render-hosted Medusa origin. Vercel terminates SSL on the subdomain; the
   * company's browser only ever sees admin.foalandpony.com. The Render URL
   * stays hidden behind the proxy.
   *
   * Set ADMIN_ORIGIN and ADMIN_HOST in Vercel env vars.
   */
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [{ type: 'host', value: ADMIN_HOST }],
          destination: `${ADMIN_ORIGIN}/:path*`,
        },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
}

module.exports = nextConfig
