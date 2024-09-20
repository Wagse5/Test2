module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Add this line to explicitly set the public folder
  publicRuntimeConfig: {
    staticFolder: '/public',
  },
};
