import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

globalThis.require = createRequire(import.meta.url);

// Build the frontend
console.log("Building frontend...");
execSync("pnpm --filter @workspace/ocean-weligama run build", { stdio: "inherit" });

// Copy the frontend build to the root dist/public directory for Vercel
console.log("Setting up frontend output...");
const frontendDist = path.resolve(process.cwd(), "artifacts/ocean-weligama/dist/public");
const vercelDist = path.resolve(process.cwd(), "dist/public");

if (fs.existsSync(vercelDist)) {
  fs.rmSync(vercelDist, { recursive: true, force: true });
}
fs.mkdirSync(path.dirname(vercelDist), { recursive: true });
if (fs.existsSync(frontendDist)) {
    fs.cpSync(frontendDist, vercelDist, { recursive: true });
}

// Build the serverless function
console.log("Building serverless function...");
const apiDir = path.resolve(process.cwd(), "api");
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

await esbuild({
  entryPoints: { index: path.resolve(process.cwd(), "artifacts/api-server/src/app.ts") },
  platform: "node",
  bundle: true,
  format: "cjs",
  outdir: apiDir,
  logLevel: "info",
  external: [
    "*.node",
    "sharp",
    "better-sqlite3",
    "sqlite3",
    "canvas",
    "bcrypt",
    "argon2",
    "fsevents",
    "re2",
    "farmhash",
    "xxhash-addon",
    "bufferutil",
    "utf-8-validate",
    "ssh2",
    "cpu-features",
    "dtrace-provider",
    "isolated-vm",
    "lightningcss",
    "pg-native",
    "oracledb",
    "mongodb-client-encryption",
    "nodemailer",
    "handlebars",
    "knex",
    "typeorm",
    "protobufjs",
    "onnxruntime-node",
    "@tensorflow/*",
    "@prisma/client",
    "@mikro-orm/*",
    "@grpc/*",
    "@swc/*",
    "@aws-sdk/*",
    "@azure/*",
    "@opentelemetry/*",
    "@google-cloud/*",
    "@google/*",
    "googleapis",
    "firebase-admin",
    "@parcel/watcher",
    "@sentry/profiling-node",
    "@tree-sitter/*",
    "aws-sdk",
    "classic-level",
    "dd-trace",
    "ffi-napi",
    "grpc",
    "hiredis",
    "kerberos",
    "leveldown",
    "miniflare",
    "mysql2",
    "newrelic",
    "odbc",
    "piscina",
    "realm",
    "ref-napi",
    "rocksdb",
    "sass-embedded",
    "sequelize",
    "serialport",
    "snappy",
    "tinypool",
    "usb",
    "workerd",
    "wrangler",
    "zeromq",
    "zeromq-prebuilt",
    "playwright",
    "puppeteer",
    "puppeteer-core",
    "electron",
  ],
  sourcemap: "inline",
  plugins: [
    esbuildPluginPino({ transports: ["pino-pretty"] })
  ],
  banner: {
    js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
  `,
  },
});

console.log("Build complete.");
