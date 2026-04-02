import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cssPath = path.join(rootDir, "styles.css");
const css = await readFile(cssPath, "utf8");

const openBraces = [...css.matchAll(/{/g)].length;
const closeBraces = [...css.matchAll(/}/g)].length;
assert.equal(openBraces, closeBraces, "styles.css has unbalanced braces.");
assert.ok(!/\t/.test(css), "styles.css should use spaces rather than tabs.");
assert.ok(!/!important/.test(css), "Avoid !important in stylesheet rules.");

for (const token of ["--green-900", "--ocean-700", "--font-display"]) {
  assert.ok(css.includes(token), `Missing design token: ${token}`);
}

for (const selector of [".lang-switch", ".victor-section", ".edu-resource-link", ".map-frame", ".contact-card"]) {
  assert.ok(css.includes(selector), `Missing required selector: ${selector}`);
}

console.log(`CSS lint passed for ${path.relative(rootDir, cssPath)}.`);
