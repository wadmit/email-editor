const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@maily-to/core': path.resolve(__dirname, '../../packages/core/dist'),
    };
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'), // Prioritize local node_modules
      ...config.resolve.modules,
    ];
    return config;
  }
};

module.exports = nextConfig;
