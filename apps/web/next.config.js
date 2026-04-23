/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Tell Next.js's Turbopack pipeline to compile @repo/game-engine from source.
   * transpilePackages makes the bundler process workspace TypeScript directly
   * without requiring a separate build/watch step for the package.
   */
  transpilePackages: ["@repo/game-engine"],

  /**
   * Empty turbopack config silences the "webpack config with no turbopack config"
   * error introduced in Next.js 16, where Turbopack is the default dev bundler.
   */
  turbopack: {},
};

export default nextConfig;
