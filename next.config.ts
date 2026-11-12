import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  // Next.js config options
	// Vercel builds its own output; 'standalone' is kept for the developer's pm2 server.
	...(process.env.VERCEL ? {} : { output: 'standalone' as const }),
	// Bundle the stored images with the image API route so it can read them on Vercel.
	outputFileTracingIncludes: {
		'/api/imgs/[section]/[imgName]': ['./public/imgs/**/*', './public/placeholder.png'],
	},
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
