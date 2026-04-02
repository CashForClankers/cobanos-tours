import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");

const copyTargets = [
  "b1a7c6f0d2e94aee9c65e6f1a4bd38c7.txt",
  "CNAME",
  "es",
  "coffee-parking-lot.jpg",
  "favicon.svg",
  "google-site-verification.html",
  "iguana-parking-lot.jpg",
  "index.html",
  "los-cobanos-day-trip-from-san-salvador.html",
  "los-cobanos-reef-guide.html",
  "robots.txt",
  "snorkeling-el-salvador.html",
  "site.webmanifest",
  "sitemap.xml",
  "styles.css",
  "sunset.jpg",
  "whale-watching-el-salvador.html",
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
