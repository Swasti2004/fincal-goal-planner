/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // generates static /out folder — works on GitHub Pages
  trailingSlash: true,     // needed for GitHub Pages routing
  reactStrictMode: true,
  images: {
    unoptimized: true,     // required for static export (no image server)
  },
};

module.exports = nextConfig;
