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
const reefEcologyPage = await readFile(path.join(rootDir, "los-cobanos-reef-ecology.html"), "utf8");
const dayTripPage = await readFile(path.join(rootDir, "los-cobanos-day-trip-from-san-salvador.html"), "utf8");
const naturalHistoryPage = await readFile(path.join(rootDir, "los-cobanos-natural-history.html"), "utf8");
const whatToDoPage = await readFile(path.join(rootDir, "what-to-do-in-los-cobanos.html"), "utf8");
const spanishPage = await readFile(path.join(rootDir, "es", "index.html"), "utf8");
const spanishNaturalHistoryPage = await readFile(path.join(rootDir, "es", "historia-natural.html"), "utf8");
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
  assert.match(html, /images\/coffee-parking-lot\.jpg/);
  assert.match(html, /images\/iguana-parking-lot\.jpg/);
  assert.match(html, /good local coffee/i);
  assert.match(html, /SS Douglas|SS Cheribon/);
  assert.match(html, /protected.*hunting pressure|menor presión de caza/i);
  assert.match(html, /docs\/content-sources\.md/);
  assert.match(html, /MARN whale project/);
  assert.match(sources, /rsis\.ramsar\.org/);
  assert.match(sources, /visitelsalvador\.ai/);
  assert.match(sources, /whales\.org/);
  assert.match(sources, /SS Douglas/);
  assert.match(sources, /Cheribon/);
  assert.match(sources, /iguanas y garrobos son vendidos en carretera/i);
  assert.match(sources, /SV2419_mgt180919\.pdf/);
  assert.match(sources, /Porites lobata \(2006-2022\)/i);
  assert.match(sources, /equinodermos/i);
  assert.match(sources, /esponjas/i);
  assert.match(sources, /dinoflagelados/i);
  assert.match(sources, /Psarocolius montezuma/i);
  assert.match(sources, /Search Spanish first/i);
  assert.match(sources, /translation layer/i);
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
  assert.match(sitemap, /es\/historia-natural\.html/);
  assert.match(sitemap, /snorkeling-el-salvador\.html/);
  assert.match(sitemap, /whale-watching-el-salvador\.html/);
  assert.match(sitemap, /los-cobanos-reef-ecology\.html/);
  assert.match(sitemap, /los-cobanos-reef-guide\.html/);
  assert.match(sitemap, /los-cobanos-day-trip-from-san-salvador\.html/);
  assert.match(sitemap, /los-cobanos-natural-history\.html/);
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
  assert.match(reefEcologyPage, /Los Cóbanos Reef Ecology/);
  assert.match(reefGuidePage, /Los Cóbanos Reef Guide/);
  assert.match(dayTripPage, /Day Trip from San Salvador/);
  assert.match(naturalHistoryPage, /Los Cóbanos Natural History/);
  assert.match(whatToDoPage, /What to Do in Los Cóbanos/);
  assert.match(spanishPage, /<html lang="es">/);
  assert.match(spanishPage, /Tours en Los Cóbanos/);
  assert.match(spanishNaturalHistoryPage, /Historia natural de Los Cóbanos/);
});

test("focused pages keep direct contact and canonical links", () => {
  for (const page of [snorkelingPage, whalesPage, reefEcologyPage, reefGuidePage, dayTripPage, naturalHistoryPage, whatToDoPage, spanishPage, spanishNaturalHistoryPage]) {
    assert.match(page, /https:\/\/wa\.me\/50364441869/);
    assert.match(page, /<link rel="canonical" href="https:\/\/los-cobanos\.com\//);
  }
});

test("key landing pages expose structured data and language alternates", () => {
  assert.match(snorkelingPage, /FAQPage/);
  assert.match(snorkelingPage, /BreadcrumbList/);
  assert.match(snorkelingPage, /hreflang="x-default"/);
  assert.match(whalesPage, /FAQPage/);
  assert.match(whalesPage, /BreadcrumbList/);
  assert.match(reefEcologyPage, /BreadcrumbList/);
  assert.match(dayTripPage, /FAQPage/);
  assert.match(dayTripPage, /BreadcrumbList/);
  assert.match(reefGuidePage, /BreadcrumbList/);
  assert.match(whatToDoPage, /FAQPage/);
  assert.match(whatToDoPage, /BreadcrumbList/);
  assert.match(naturalHistoryPage, /BreadcrumbList/);
  assert.match(spanishPage, /LocalBusiness/);
  assert.match(sitemap, /xmlns:xhtml=/);
  assert.match(sitemap, /xhtml:link rel="alternate" hreflang="es-SV"/);
});

test("natural history page stays specific and source-backed", () => {
  assert.match(naturalHistoryPage, /74 macroalgae species/i);
  assert.match(naturalHistoryPage, /13 intertidal echinoderm species/i);
  assert.match(naturalHistoryPage, /Psarocolius montezuma/);
  assert.match(naturalHistoryPage, /Mangroves and birds belong in the same Los Cóbanos story/i);
  assert.match(naturalHistoryPage, /los-cobanos-reef-ecology\.html/);
  assert.match(naturalHistoryPage, /docs\/natural-history\/OVERVIEW\.md/);
  assert.match(naturalHistoryPage, /es\/historia-natural\.html/);
  assert.match(naturalHistoryPage, /SV2419_mgt180919\.pdf/);
  assert.match(naturalHistoryPage, /S0034-77442023000200006/);
  assert.match(html, /los-cobanos-natural-history\.html/);
});

test("spanish natural history page mirrors the same source-backed angles", () => {
  assert.match(spanishNaturalHistoryPage, /74 especies de macroalgas/i);
  assert.match(spanishNaturalHistoryPage, /191 especies de aves/i);
  assert.match(spanishNaturalHistoryPage, /Psarocolius montezuma/);
  assert.match(spanishNaturalHistoryPage, /Manglares y aves también explican el lugar/i);
  assert.match(spanishNaturalHistoryPage, /los-cobanos-reef-ecology\.html/);
  assert.match(spanishNaturalHistoryPage, /docs\/natural-history\/OVERVIEW\.md/);
  assert.match(spanishNaturalHistoryPage, /SV2419_mgt180919\.pdf/);
  assert.match(spanishNaturalHistoryPage, /S0034-77442023000200006/);
  assert.match(spanishPage, /historia-natural\.html/);
});

test("reef ecology page stays source-backed and constrained", () => {
  assert.match(reefEcologyPage, /Porites lobata/);
  assert.match(reefEcologyPage, /74 macroalgae species/i);
  assert.match(reefEcologyPage, /Bleaching from 2006 to 2022/i);
  assert.match(reefEcologyPage, /docs\/content-sources\.md/);
  assert.match(reefEcologyPage, /What this page does not claim/i);
  assert.match(reefEcologyPage, /los-cobanos-natural-history\.html/);
});

test("search console verification placeholder remains explicit", () => {
  assert.match(gscVerification, /placeholder/i);
});

test("indexnow is wired for non-Google search engines", () => {
  assert.equal(indexNowKey.trim(), "b1a7c6f0d2e94aee9c65e6f1a4bd38c7");
  assert.match(packageJson, /submit:indexnow/);
  assert.match(promotionPlaybook, /IndexNow/i);
});
