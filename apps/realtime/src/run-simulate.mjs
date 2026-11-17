import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";

const require = createRequire(import.meta.url);
const vitestDir = path.dirname(require.resolve("vitest"));
const esbuildPath = require.resolve("esbuild", {
  paths: [vitestDir, path.resolve("../../node_modules/.pnpm/node_modules")],
});
const esbuild = require(esbuildPath);

const outfile = "/tmp/tfi-realtime-simulate.mjs";
esbuild.buildSync({
  entryPoints: ["src/simulate.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
  outfile,
});

const res = spawnSync(process.execPath, [outfile], { stdio: "inherit" });
process.exit(res.status ?? 1);
