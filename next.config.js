/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next.js 14: prevent bundling native Node binaries on the server
  experimental: {
    serverComponentsExternalPackages: ['sodium-native', 'require-addon'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        'sodium-native': false,
        'require-addon': false,
        path: false,
        crypto: false,
      };
    }
    // Suppress critical dependency warnings from native modules
    config.ignoreWarnings = [
      { module: /sodium-native/ },
      { module: /require-addon/ },
    ];
    return config;
  },
};

module.exports = nextConfig;
