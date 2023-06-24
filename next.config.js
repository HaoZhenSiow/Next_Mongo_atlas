/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
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
