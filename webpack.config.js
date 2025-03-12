const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  resolve: {
    alias: {
      // Map `node:` to standard modules
      "node:assert": require.resolve("assert-browserify"),
      "node:buffer": require.resolve("buffer/"),
      "node:crypto": require.resolve("crypto-browserify"),
      "node:stream": require.resolve("stream-browserify"),
      "node:os": require.resolve("os-browserify/browser"),
      "node:util": require.resolve("util/"),
      "node:path": require.resolve("path-browserify"),
      "node:url": require.resolve("url/"),
      "node:querystring": require.resolve("querystring-es3"),
    },
    fallback: {
      "path": require.resolve("path-browserify"),
      "tty": require.resolve("tty-browserify"),
      "url": require.resolve("url/"),
      "querystring": require.resolve("querystring-es3"),
      "https": require.resolve("https-browserify"),
      "http": require.resolve("stream-http"),
      "zlib": require.resolve("browserify-zlib"),
      "constants": require.resolve("constants-browserify"),
      "vm": require.resolve("vm-browserify"),
      "assert": require.resolve("assert-browserify"),
      "buffer": require.resolve("buffer/"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "os": require.resolve("os-browserify/browser"),
      "process": require.resolve("process/browser"),
      "v8": false,
      "child_process": false,
      "fs": false,
      "dns": false,
      "net": false,
      "tls": false,
      "http2": false,
      "module": false,
      "readline": false,
      "spdx-license-ids": false,
      "node:async_hooks": false,
    },
  },
  module: {
    rules: [
      {
        test: /\.cs$/,
        use: "ignore-loader", // Ignore .cs files (if not needed)
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false, // Resolve `node:assert` and other node: imports
        },
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin(), // Automatically polyfill Node.js core modules
    new webpack.IgnorePlugin({
      resourceRegExp: /^child_process$/, // Ignore child_process (not needed in frontend)
    }),
  ],
};
