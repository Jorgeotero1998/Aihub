const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix monorepo root inference on Windows (multiple lockfiles)
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

module.exports = nextConfig;

