const path = require('path');

/**
 * Next.js config to alias 'rc-util/es' imports to the CommonJS 'lib' folder.
 * Some packages import `rc-util/es/...` which may not be resolved in this setup;
 * mapping to `rc-util/lib` fixes `ERR_MODULE_NOT_FOUND` in many cases.
 */
module.exports = {
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'rc-util/es': path.resolve(__dirname, 'node_modules/rc-util/lib'),
      'rc-picker/es': path.resolve(__dirname, 'node_modules/rc-picker/lib'),
      '@ant-design/icons-svg/es': path.resolve(__dirname, 'node_modules/@ant-design/icons-svg/lib'),
      '@ant-design/icons/es': path.resolve(__dirname, 'node_modules/@ant-design/icons/lib'),
    };
    return config;
  },
};

