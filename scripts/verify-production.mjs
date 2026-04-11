const owner = process.env.SITE_OWNER || "CashForClankers";
const repo = process.env.SITE_REPO || "cobanos-tours";
const domain = process.env.SITE_DOMAIN || "los-cobanos.com";
const branch = process.env.SITE_BRANCH || "main";
const sourcePath = process.env.SITE_SOURCE_PATH || "/";
const retries = Number.parseInt(process.env.VERIFY_RETRIES || "1", 10);
const delayMs = Number.parseInt(process.env.VERIFY_DELAY_MS || "0", 10);
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "";

const pagesApiUrl = `https://api.github.com/repos/${owner}/${repo}/pages`;
const projectUrl = `https://${owner.toLowerCase()}.github.io/${repo}/`;
const siteUrl = `https://${domain}/`;
const expectedTitle = "Los Cóbanos Tours";
const githubPages404Marker = "There isn't a GitHub Pages site here.";

function log(message) {
  console.log(`[verify-production] ${message}`);
}

function fail(message) {
  throw new Error(message);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  return { response, text };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let json = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  return { response, text, json };
}

async function verifyPagesConfiguration() {
  if (!token) {
    log("Skipping GitHub Pages API check because GH_TOKEN/GITHUB_TOKEN is not set.");
    return;
  }

  log(`Checking Pages API for ${owner}/${repo}`);

  const { response, json, text } = await fetchJson(pagesApiUrl, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "cobanos-tours-production-check"
    }
  });

  if (!response.ok) {
    fail(`Pages API check failed with ${response.status}: ${text}`);
  }

  if (!json) {
    fail("Pages API returned an unreadable response.");
  }

  if (json.cname !== domain) {
    fail(`Expected Pages custom domain ${domain}, got ${json.cname ?? "none"}.`);
  }

  if (!json.https_enforced) {
    fail("Expected GitHub Pages HTTPS enforcement to be enabled.");
  }

  if (!json.source || json.source.branch !== branch || json.source.path !== sourcePath) {
    fail(`Expected Pages source ${branch}:${sourcePath}, got ${JSON.stringify(json.source)}.`);
  }

  if (json.status !== "built" && json.status !== "building") {
    fail(`Expected Pages status to be built or building, got ${json.status}.`);
  }

  log(`Pages config OK: status=${json.status}, cname=${json.cname}`);
}

async function verifyProjectRedirect() {
  log(`Checking project URL redirect ${projectUrl}`);

  const response = await fetch(projectUrl, {
    redirect: "manual",
    headers: {
      "Cache-Control": "no-cache"
    }
  });

  if (!response.ok && (response.status < 300 || response.status > 399)) {
    fail(`Expected project URL redirect, got HTTP ${response.status}.`);
  }

  const location = response.headers.get("location") || "";
  if (!location.startsWith(siteUrl)) {
    fail(`Expected project URL to redirect to ${siteUrl}, got ${location || "no location header"}.`);
  }

  log(`Project URL redirect OK: ${location}`);
}

async function verifyLiveSite() {
  log(`Checking live site ${siteUrl}`);

  const { response, text } = await fetchText(siteUrl, {
    redirect: "follow",
    headers: {
      "Cache-Control": "no-cache"
    }
  });

  if (!response.ok) {
    fail(`Live site check failed with HTTP ${response.status}.`);
  }

  if (text.includes(githubPages404Marker)) {
    fail("Live site is serving the generic GitHub Pages 404 page.");
  }

  if (!text.includes(expectedTitle)) {
    fail(`Live site response did not include expected title fragment: ${expectedTitle}.`);
  }

  if (!text.includes("https://wa.me/50364441869")) {
    fail("Live site response did not include the primary booking contact link.");
  }

  log(`Live site OK: HTTP ${response.status}`);
}

async function runAttempt(attempt) {
  log(`Attempt ${attempt}/${retries}`);
  await verifyPagesConfiguration();
  await verifyProjectRedirect();
  await verifyLiveSite();
}

let lastError = null;

for (let attempt = 1; attempt <= retries; attempt += 1) {
  try {
    await runAttempt(attempt);
    log("All production checks passed.");
    process.exit(0);
  } catch (error) {
    lastError = error;
    log(`Attempt ${attempt} failed: ${error.message}`);

    if (attempt < retries && delayMs > 0) {
      await wait(delayMs);
    }
  }
}

fail(lastError ? lastError.message : "Production verification failed.");
