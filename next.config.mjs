// next.config.mjs
import path from 'path';
import { fileURLToPath } from 'url'; // Import this!

const __filename = fileURLToPath(import.meta.url); // Get the filename
const __dirname = path.dirname(__filename);       // Get the directory name

let userConfig = undefined;
try {
  userConfig = await import('./v0-user-next.config');
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  webpack: (config, options) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
    };
    return config;
  },
  output: 'export',  // <---- ADD THIS LINE
};

function mergeConfig(nextConfig, userConfig) {
    if (!userConfig) {
        return;
    }

    for (const key in userConfig) {
        if (
        typeof nextConfig[key] === 'object' &&
        !Array.isArray(nextConfig[key])
        ) {
        nextConfig[key] = {
            ...nextConfig[key],
            ...userConfig[key],
        };
        } else {
        nextConfig[key] = userConfig[key];
        }
    }
}

mergeConfig(nextConfig, userConfig);
export default nextConfig;