/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.bisnis.com',
      },
      {
        protocol: 'https',
        hostname: '**.detik.com',
      },
      {
        protocol: 'https',
        hostname: 'akcdn.detik.net.id',
      },
      {
        protocol: 'https',
        hostname: 'images.bisnis.com',
      },
      {
        protocol: 'https',
        hostname: '**.kompas.com',
      },
      {
        protocol: 'https',
        hostname: 'asset.kompas.com',
      },
      {
        protocol: 'https',
        hostname: 'asset-2.kompas.com',
      },
      {
        protocol: 'https',
        hostname: '**.cnnindonesia.com',
      },
      {
        protocol: 'https',
        hostname: '**.cnbcindonesia.com',
      },
      {
        protocol: 'https',
        hostname: '**.tempo.co',
      },
      {
        protocol: 'https',
        hostname: '**.republika.co.id',
      }
    ],
    unoptimized: true
  }
}

module.exports = nextConfig