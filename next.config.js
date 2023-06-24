/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/login',
        has: [
          {
            type: 'cookie',
            key: 'token'
          }
        ],
        destination: '/',
        permanent: false
      },
      {
        source: '/signup',
        has: [
          {
            type: 'cookie',
            key: 'token'
          }
        ],
        destination: '/',
        permanent: false
      },
      {
        source: '/',
        missing: [
          {
            type: 'cookie',
            key: 'token'
          }
        ],
        destination: '/login',
        permanent: false
      }
    ]
  }
}

module.exports = nextConfig
