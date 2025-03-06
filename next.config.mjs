//next.config.mjs


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  //basePath: '/docs',
};

console.log("Merged Next.js config:", nextConfig); // ADD THIS LINE

export default nextConfig;