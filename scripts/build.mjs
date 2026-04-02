import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");

const copyTargets = [
  "CNAME",
  "index.html",
  "styles.css",
  "sunset.jpg",
  "beach.jpg",
  "sign.jpg",
  "docs"
];

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

for (const target of copyTargets) {
  const source = path.join(rootDir, target);
  await stat(source);
  await cp(source, path.join(distDir, target), { recursive: true });
}

console.log(`Built static site into ${path.relative(rootDir, distDir)}.`);
