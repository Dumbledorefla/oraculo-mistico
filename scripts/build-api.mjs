/**
 * Build script for Vercel Serverless Function
 * Bundles api/index.ts into a single api/index.mjs file
 * with all dependencies resolved at build time.
 */
import * as esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

await esbuild.build({
  entryPoints: [path.join(projectRoot, "api/index.ts")],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: path.join(projectRoot, "api/index.mjs"),
  // Mark native Node.js modules as external
  // Also mark packages that have native bindings or are problematic to bundle
  external: [],
  // Resolve TypeScript path aliases
  alias: {
    "@shared": path.join(projectRoot, "shared"),
  },
  // Handle .ts files
  loader: {
    ".ts": "ts",
  },
  // Define environment for tree-shaking
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  // Generate sourcemap for debugging
  sourcemap: false,
  // Minify for smaller bundle
  minify: false,
  // Banner to ensure proper ESM handling
  banner: {
    js: `
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
`,
  },
  // Log level
  logLevel: "info",
});

console.log("✅ API bundle built successfully: api/index.mjs");
