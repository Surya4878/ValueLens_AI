/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://login.microsoftonline.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' http://localhost:8080 http://127.0.0.1:8080 https://*.hana.ondemand.com https://*.ondemand.com https://accounts.google.com https://login.microsoftonline.com; frame-src https://accounts.google.com https://login.microsoftonline.com; frame-ancestors 'none';"
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/terms',
        destination: 'https://incture.com/terms-of-service/',
        permanent: false,
      },
      {
        source: '/privacy',
        destination: 'https://incture.com/privacy-policy/',
        permanent: false,
      },
      {
        source: '/contact',
        destination: 'https://incture.com/contact-us/',
        permanent: false,
      },
      {
        source: '/contact-us',
        destination: 'https://incture.com/contact-us/',
        permanent: false,
      },
    ];
  }
};

module.exports = nextConfig;
