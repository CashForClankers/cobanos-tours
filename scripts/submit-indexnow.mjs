import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const key = "b1a7c6f0d2e94aee9c65e6f1a4bd38c7";
const keyLocation = `https://los-cobanos.com/${key}.txt`;

const sitemap = await readFile(path.join(rootDir, "sitemap.xml"), "utf8");
const urlList = [...sitemap.matchAll(/<loc>(https:\/\/los-cobanos\.com\/[^<]*)<\/loc>/g)].map((match) => match[1]);

assert.ok(urlList.length > 0, "Expected at least one sitemap URL to submit.");

const response = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: {
    "content-type": "application/json; charset=utf-8"
  },
  body: JSON.stringify({
    host: "los-cobanos.com",
    key,
    keyLocation,
    urlList
  })
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(`IndexNow submission failed with ${response.status}: ${body}`);
}

console.log(`Submitted ${urlList.length} URLs to IndexNow for los-cobanos.com.`);
