import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(rootDir, "index.html");
const html = await readFile(htmlPath, "utf8");

assert.match(html, /<!doctype html>/i, "index.html must declare a doctype.");
assert.match(html, /<html lang="en">/i, "The document must default to English.");
assert.match(html, /<main id="main-content">/i, "The page should include a main landmark.");
assert.ok(!/on(click|change|submit|keydown)\s*=/i.test(html), "Inline event handlers are not allowed.");
assert.ok(!/<style[\s>]/i.test(html), "Section styles should live in styles.css.");
assert.ok(!/\sstyle="/i.test(html), "Inline style attributes are not allowed.");
assert.ok(!/youtu\.?be|youtube\.com/i.test(html), "Do not link directly to YouTube from the page.");

const requiredAnchors = [
  "#tours",
  "#reef",
  "#wildlife",
  "#plan",
  "#victor",
  "#map",
  "#contact",
  "https://wa.me/50364441869",
  "tel:+50364441869",
  "docs/content-sources.md"
];

for (const href of requiredAnchors) {
  assert.ok(html.includes(`href="${href}"`), `Missing required link: ${href}`);
}

for (const sectionId of ["tours", "reef", "victor", "wildlife", "plan", "map", "about", "contact"]) {
  assert.ok(html.includes(`<section id="${sectionId}"`), `Missing section: ${sectionId}`);
}

const localAssetRefs = [...html.matchAll(/(?:src|href)="([^":?#]+?\.(?:css|jpg|png|md))"/gi)].map((match) => match[1]);
for (const relativeRef of localAssetRefs) {
  await access(path.join(rootDir, relativeRef));
}

const imageTags = [...html.matchAll(/<img\b[^>]*alt="([^"]*)"[^>]*>/gi)];
assert.ok(imageTags.length >= 3, "The site should include at least three descriptive images.");
for (const [, altText] of imageTags) {
  assert.ok(altText.trim().length > 0, "Every image needs alt text.");
}

console.log(`HTML lint passed for ${path.relative(rootDir, htmlPath)}.`);
