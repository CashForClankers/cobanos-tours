import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const publicPages = [
  "index.html",
  "snorkeling-el-salvador.html",
  "whale-watching-el-salvador.html",
  "los-cobanos-reef-guide.html",
  "los-cobanos-day-trip-from-san-salvador.html",
  "los-cobanos-natural-history.html",
  "what-to-do-in-los-cobanos.html",
  path.join("es", "index.html"),
  path.join("es", "historia-natural.html")
];

for (const relativePath of publicPages) {
  const htmlPath = path.join(rootDir, relativePath);
  const html = await readFile(htmlPath, "utf8");
  const pageDir = path.dirname(htmlPath);
  const expectedLang = relativePath.startsWith(`es${path.sep}`) ? "es" : "en";

  assert.match(html, /<!doctype html>/i, `${relativePath} must declare a doctype.`);
  assert.match(html, new RegExp(`<html lang="${expectedLang}">`, "i"), `${relativePath} must declare the expected document language.`);
  assert.match(html, /<main id="main-content">/i, `${relativePath} should include a main landmark.`);
  assert.ok(!/on(click|change|submit|keydown)\s*=/i.test(html), `${relativePath} must not use inline event handlers.`);
  assert.ok(!/<style[\s>]/i.test(html), `${relativePath} must keep styles in styles.css.`);
  assert.ok(!/\sstyle="/i.test(html), `${relativePath} must not use inline style attributes.`);
  assert.ok(!/youtu\.?be|youtube\.com/i.test(html), `${relativePath} must not link directly to YouTube.`);
  assert.match(html, /<title>.+<\/title>/i, `${relativePath} needs a title.`);
  assert.match(html, /<meta name="description" content="[^"]+"/i, `${relativePath} needs a meta description.`);
  assert.match(html, /<link rel="canonical" href="https:\/\/los-cobanos\.com\//i, `${relativePath} must use the los-cobanos.com canonical domain.`);

  const localAssetRefs = [...html.matchAll(/(?:src|href)="([^":?#]+?\.(?:css|jpg|png|svg|xml|txt|webmanifest|md|html))"/gi)].map((match) => match[1]);
  for (const relativeRef of localAssetRefs) {
    if (relativeRef.startsWith("/")) {
      continue;
    }
    await access(path.resolve(pageDir, relativeRef));
  }

  const imageTags = [...html.matchAll(/<img\b[^>]*alt="([^"]*)"[^>]*>/gi)];
  for (const [, altText] of imageTags) {
    assert.ok(altText.trim().length > 0, `Every image in ${relativePath} needs alt text.`);
  }

  if (relativePath === "index.html") {
    assert.match(html, /application\/ld\+json/i, "index.html must include structured data.");
    for (const href of [
      "#tours",
      "#reef",
      "#wildlife",
      "#plan",
      "#victor",
      "#map",
      "#contact",
      "https://wa.me/50364441869",
      "tel:+50364441869",
      "docs/content-sources.md",
      "site.webmanifest",
      "favicon.svg"
    ]) {
      assert.ok(html.includes(`href="${href}"`), `index.html is missing required link: ${href}`);
    }
    for (const sectionId of ["tours", "reef", "victor", "wildlife", "plan", "map", "about", "contact"]) {
      assert.ok(html.includes(`<section id="${sectionId}"`), `index.html is missing section: ${sectionId}`);
    }
    assert.ok(imageTags.length >= 3, "index.html should include at least three descriptive images.");
  }
}

console.log(`HTML lint passed for ${publicPages.length} public pages.`);
