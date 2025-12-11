/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    // Force webpack instead of Turbopack for compatibility
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                os: false,
            };
        }
        
        // Exclude test files from being bundled
        config.module.rules.forEach(rule => {
            if (rule.test && rule.test.toString().includes('js')) {
                rule.exclude = [
                    ...(rule.exclude || []),
                    /\.test\.(js|jsx|ts|tsx)$/,
                    /\.spec\.(js|jsx|ts|tsx)$/,
                    /node_modules\/.*\/test\//
                ];
            }
        });
        
        return config;
    },
};

export default nextConfig;
