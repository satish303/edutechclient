module.exports = function override(config, env) {
    // Ignore face-api.js source maps
    const sourceMapLoaderRule = config.module.rules.find(rule => rule.enforce === 'pre');
    if (sourceMapLoaderRule) {
      if (!Array.isArray(sourceMapLoaderRule.exclude)) {
        sourceMapLoaderRule.exclude = sourceMapLoaderRule.exclude
          ? [sourceMapLoaderRule.exclude]
          : [];
      }
      sourceMapLoaderRule.exclude.push(/face-api.js/);
    }
  
    // Prevent Webpack from trying to resolve Node.js modules like 'fs'
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
  
    return config;
  };
  