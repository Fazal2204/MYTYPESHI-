const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert/"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "url": require.resolve("url/"),
        "path": require.resolve("path-browserify"),
        "fs": require.resolve("browserify-fs"),
        "querystring": require.resolve("querystring-es3"),
        "events": require.resolve("events/"),
        "zlib": require.resolve("browserify-zlib"),
        "util": require.resolve("util/"),
        "vm": require.resolve("vm-browserify")
    });
    config.resolve.fallback = fallback;
    
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
            // THIS IS THE CORRECTED LINE
            global: require.resolve('global') 
        })
    ]);
    
    return config;
}