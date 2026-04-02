import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(path.join(rootDir, "index.html"), "utf8");
const sources = await readFile(path.join(rootDir, "docs", "content-sources.md"), "utf8");
const cname = await readFile(path.join(rootDir, "CNAME"), "utf8");

test("primary contact flow is present", () => {
  assert.match(html, /Victor/i);
  assert.match(html, /https:\/\/wa\.me\/50364441869/);
  assert.match(html, /tel:\+50364441869/);
  assert.match(html, /cash/i);
  assert.match(html, /Bitcoin/i);
  assert.match(html, /13\.5254549,\s*-89\.8061826/);
});

test("bilingual controls and content hooks exist", () => {
  assert.match(html, /data-set-lang="en"/);
  assert.match(html, /data-set-lang="es"/);
  assert.match(html, /localStorage\.setItem\(['"]cobanos-lang['"]/);
  assert.match(html, /data-lang="en"/);
  assert.match(html, /data-lang="es"/);
});

test("wildlife references stay connected to sources", () => {
  const iNaturalistLinks = [...html.matchAll(/https:\/\/www\.inaturalist\.org\/observations\?/g)];
  assert.ok(iNaturalistLinks.length >= 3, "Expected at least three iNaturalist observation links.");
  assert.match(html, /docs\/content-sources\.md/);
  assert.match(sources, /rsis\.ramsar\.org/);
  assert.match(sources, /visitelsalvador\.ai/);
  assert.match(sources, /whales\.org/);
  assert.doesNotMatch(html, /youtu\.?be|youtube\.com/i);
  assert.doesNotMatch(sources, /youtu\.?be|youtube\.com/i);
});

test("critical sections remain in place", () => {
  for (const sectionId of ["tours", "reef", "victor", "wildlife", "plan", "map", "contact"]) {
    assert.ok(html.includes(`<section id="${sectionId}"`), `Missing section: ${sectionId}`);
  }
});

test("custom domain is checked into the repo", () => {
  assert.equal(cname.trim(), "los-cobanos.com");
});
