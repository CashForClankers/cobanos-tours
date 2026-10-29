import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../analytics.js', import.meta.url), 'utf8');
function browser({ saved = null, blocked = false, storageFails = false, hostname = 'los-cobanos.com' } = {}) {
  const tags = [], handlers = {}, cookies = [];
  const elements = [];
  const button = { focus() {} };
  const footer = { append() {} };
  const panel = { hidden: false, setAttribute() {}, querySelector: () => button,
    addEventListener: (name, fn) => { handlers[name] = fn; } };
  const settings = { addEventListener() {}, focus() {} };
  const document = {
    documentElement: { lang: 'en' },
    currentScript: { dataset: { measurementId: 'G-TEST123456', hostnames: 'los-cobanos.com,www.los-cobanos.com' } },
    createElement: tag => tag === 'section' ? panel : tag === 'button' ? settings : {},
    body: { append: item => elements.push(item) }, head: { append: item => tags.push(item) },
    referrer: 'https://example.com/private/person?email=private@example.com',
    querySelector: selector => selector === 'footer' ? footer : { href: 'https://los-cobanos.com/books/?email=private@example.com#prompt' },
    get cookie() { return '_ga=old; _ga_TEST123456=old; essential=keep'; },
    set cookie(value) { cookies.push(value); },
  };
  let reloads = 0, stored;
  const window = {};
  vm.runInNewContext(source, { document, window, URL, Date,
    location: { hostname, origin: 'https://los-cobanos.com', href: 'https://los-cobanos.com/?prompt=secret', reload() { reloads++; } },
    navigator: { globalPrivacyControl: blocked },
    localStorage: { getItem() { if (storageFails) throw Error('blocked'); return JSON.stringify(saved); }, setItem(_, value) { stored = value; } },
  });
  return { tags, panel, cookies, window, get reloads() { return reloads; }, get stored() { return stored; },
    choose(value) { handlers.click({ target: { closest: () => ({ dataset: { analytics: value } }) } }); } };
}
test('no request before consent; grant loads once with sanitized page/referrer and Ads denied', () => {
  const b = browser();
  assert.equal(b.tags.length, 0);
  assert.equal(b.panel.hidden, false);
  b.choose('granted'); b.choose('granted');
  assert.equal(b.tags.length, 1);
  const calls = b.window.dataLayer.map(args => Array.from(args));
  assert.equal(calls[0][2].ad_storage, 'denied');
  assert.equal(calls[0][2].ad_user_data, 'denied');
  assert.equal(calls.at(-1)[2].page_location, 'https://los-cobanos.com/books/');
  assert.equal(calls.at(-1)[2].page_referrer, 'https://example.com/');
  assert.equal(calls.at(-1)[2].allow_google_signals, false);
  assert(!JSON.stringify(calls).includes('private@example.com'));
  b.choose('denied');
  assert.equal(b.window['ga-disable-G-TEST123456'], true);
  assert.equal(b.reloads, 1);
  assert(b.cookies.every(value => !value.startsWith('essential=')));
});
test('denial, GPC, expired consent, other hosts and blocked storage stay safe', () => {
  const now = Date.now();
  assert.equal(browser({ saved: { value: 'granted', time: now } }).tags.length, 1);
  for (const options of [
    { saved: { value: 'denied', time: now } },
    { saved: { value: 'granted', time: 0 } },
    { blocked: true, saved: { value: 'granted', time: now } },
    { hostname: 'localhost' }, { storageFails: true },
  ]) assert.equal(browser(options).tags.length, 0);
  const b = browser({ blocked: true }); b.choose('granted');
  assert.equal(b.tags.length, 0);
  const c = browser({ storageFails: true }); c.choose('granted');
  assert.equal(c.tags.length, 1);
});


test('all public HTML pages include one client tag and no Google tag on verification file', async () => {
  const { readdirSync } = await import('node:fs');
  const files = [...readdirSync(new URL('../', import.meta.url)).filter(n => n.endsWith('.html')).map(n => '../' + n), ...readdirSync(new URL('../es/', import.meta.url)).filter(n => n.endsWith('.html')).map(n => '../es/' + n)];
  for (const file of files) {
    const html = readFileSync(new URL(file, import.meta.url), 'utf8');
    const count = (html.match(/data-measurement-id="G-VQEMFY0KZ9"/g) || []).length;
    assert.equal(count, html.includes('<body') && !file.endsWith('google-site-verification.html') ? 1 : 0, file);
  }
});
