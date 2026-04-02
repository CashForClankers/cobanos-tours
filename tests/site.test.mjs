import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(path.join(rootDir, "index.html"), "utf8");
const sources = await readFile(path.join(rootDir, "docs", "content-sources.md"), "utf8");
const promotionPlaybook = await readFile(path.join(rootDir, "docs", "promotion-playbook.md"), "utf8");
const cname = await readFile(path.join(rootDir, "CNAME"), "utf8");
const robots = await readFile(path.join(rootDir, "robots.txt"), "utf8");
const sitemap = await readFile(path.join(rootDir, "sitemap.xml"), "utf8");
const snorkelingPage = await readFile(path.join(rootDir, "snorkeling-el-salvador.html"), "utf8");
const whalesPage = await readFile(path.join(rootDir, "whale-watching-el-salvador.html"), "utf8");
const reefGuidePage = await readFile(path.join(rootDir, "los-cobanos-reef-guide.html"), "utf8");
const dayTripPage = await readFile(path.join(rootDir, "los-cobanos-day-trip-from-san-salvador.html"), "utf8");
const whatToDoPage = await readFile(path.join(rootDir, "what-to-do-in-los-cobanos.html"), "utf8");
const spanishPage = await readFile(path.join(rootDir, "es", "index.html"), "utf8");
const gscVerification = await readFile(path.join(rootDir, "google-site-verification.html"), "utf8");
const indexNowKey = await readFile(path.join(rootDir, "b1a7c6f0d2e94aee9c65e6f1a4bd38c7.txt"), "utf8");
const packageJson = await readFile(path.join(rootDir, "package.json"), "utf8");

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
  assert.match(html, /coffee-parking-lot\.jpg/);
  assert.match(html, /iguana-parking-lot\.jpg/);
  assert.match(html, /good local coffee/i);
  assert.match(html, /SS Douglas|SS Cheribon/);
  assert.match(html, /docs\/content-sources\.md/);
  assert.match(html, /MARN whale project/);
  assert.match(sources, /rsis\.ramsar\.org/);
  assert.match(sources, /visitelsalvador\.ai/);
  assert.match(sources, /whales\.org/);
  assert.match(sources, /SS Douglas/);
  assert.match(sources, /Cheribon/);
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

test("seo crawl assets and canonical domain exist", () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/los-cobanos\.com\/">/);
  assert.match(html, /application\/ld\+json/);
  assert.match(robots, /Sitemap:\s+https:\/\/los-cobanos\.com\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/los-cobanos\.com\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/los-cobanos\.com\/es\/<\/loc>/);
  assert.match(sitemap, /snorkeling-el-salvador\.html/);
  assert.match(sitemap, /whale-watching-el-salvador\.html/);
  assert.match(sitemap, /los-cobanos-reef-guide\.html/);
  assert.match(sitemap, /los-cobanos-day-trip-from-san-salvador\.html/);
  assert.match(sitemap, /what-to-do-in-los-cobanos\.html/);
});

test("promotion playbook documents low-account outreach", () => {
  assert.match(promotionPlaybook, /Google Business Profile/);
  assert.match(promotionPlaybook, /TripAdvisor/);
  assert.match(promotionPlaybook, /Reddit/);
  assert.match(promotionPlaybook, /https:\/\/los-cobanos\.com\//);
  assert.match(promotionPlaybook, /google-site-verification\.html/);
});

test("supporting landing pages exist for targeted search intents", () => {
  assert.match(snorkelingPage, /Snorkeling El Salvador/);
  assert.match(whalesPage, /Whale Watching El Salvador/);
  assert.match(reefGuidePage, /Los Cóbanos Reef Guide/);
  assert.match(dayTripPage, /Day Trip from San Salvador/);
  assert.match(whatToDoPage, /What to Do in Los Cóbanos/);
  assert.match(spanishPage, /<html lang="es">/);
  assert.match(spanishPage, /Tours en Los Cóbanos/);
});

test("focused pages keep direct contact and canonical links", () => {
  for (const page of [snorkelingPage, whalesPage, reefGuidePage, dayTripPage, whatToDoPage, spanishPage]) {
    assert.match(page, /https:\/\/wa\.me\/50364441869/);
    assert.match(page, /<link rel="canonical" href="https:\/\/los-cobanos\.com\//);
  }
});

test("search console verification placeholder remains explicit", () => {
  assert.match(gscVerification, /placeholder/i);
});

test("indexnow is wired for non-Google search engines", () => {
  assert.equal(indexNowKey.trim(), "b1a7c6f0d2e94aee9c65e6f1a4bd38c7");
  assert.match(packageJson, /submit:indexnow/);
  assert.match(promotionPlaybook, /IndexNow/i);
});
