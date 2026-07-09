/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  output: (process.env.IS_CAPACITOR === "true" && process.env.NODE_ENV === "production") ? "export" : undefined,
  trailingSlash: true,
};

export default nextConfig;
