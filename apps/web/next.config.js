const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.alias = {
          ...config.resolve.alias,
          '@maily-to/core': path.resolve(__dirname, '../../packages/core/dist'),
        };
        return config;
      },
    
};

module.exports = nextConfig;
