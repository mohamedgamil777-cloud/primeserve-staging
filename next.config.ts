import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  // Next.js config options
	output: 'standalone',
	webpack: (config, { isServer }) => {
		config.externals = config.externals || [];
		config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
		if (!isServer) {
			config.resolve.fallback = { fs: false };
		}
		return config;
	},
	// experimental: {
    // 	nodeMiddleware: true, // Enable Node.js middleware
  	// },
	eslint: {
		ignoreDuringBuilds: true, // ✅ Ignore ESLint errors during builds
	},
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
