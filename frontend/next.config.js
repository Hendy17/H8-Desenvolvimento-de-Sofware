/**
 * Next.js config for Mantine UI setup
 */
module.exports = {
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks']
  }
};

