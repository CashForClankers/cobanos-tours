// Basic consent mode: no Google request until the visitor allows analytics.
(() => {
  const script = document.currentScript;
  const id = script?.dataset.measurementId;
  const hosts = (script?.dataset.hostnames || '').split(',');
  if (!/^G-[A-Z0-9]+$/.test(id || '')) return;
  const key = 'site-analytics-consent-v1';
  const blocked = navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';
  const expiry = 180 * 24 * 60 * 60 * 1000;
  let choice = null;
  let started = false;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && ['granted', 'denied'].includes(saved.value) && Date.now() - saved.time >= 0 && Date.now() - saved.time < expiry) choice = saved.value;
  } catch { /* A choice still works for this page when storage is unavailable. */ }
  if (blocked) choice = 'denied';

  const spanish = document.documentElement.lang === 'es';
  const panel = document.createElement('section');
  panel.className = 'analytics-choice';
  panel.setAttribute('aria-label', 'Website analytics');
  panel.innerHTML = '<p>Allow Google Analytics to measure visits? Analytics stays off until you allow it. Advertising tracking stays off. <a href="/privacy/">Privacy</a></p><div><button type="button" data-analytics="granted">Allow analytics</button><button type="button" data-analytics="denied">Keep analytics off</button></div>';
  if (blocked) panel.innerHTML = '<p>Your browser’s privacy signal keeps analytics off. Advertising tracking stays off. <a href="/privacy/">Privacy</a></p><div><button type="button" data-analytics="denied">Keep analytics off</button></div>';
  if (spanish) panel.innerHTML = blocked
    ? '<p>La señal de privacidad de tu navegador mantiene la analítica desactivada. El seguimiento publicitario está desactivado. <a href="/privacy.html">Privacidad</a></p><div><button type="button" data-analytics="denied">Mantener desactivada</button></div>'
    : '<p>¿Permitir que Google Analytics mida las visitas? La analítica permanece desactivada hasta que lo permitas. El seguimiento publicitario está desactivado. <a href="/privacy.html">Privacidad</a></p><div><button type="button" data-analytics="granted">Permitir analítica</button><button type="button" data-analytics="denied">Mantener desactivada</button></div>';
  panel.querySelector('a').href = script.dataset.privacyPath || '/privacy.html';
  panel.hidden = choice !== null;
  document.body.append(panel);
  const settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'analytics-settings';
  settings.textContent = spanish ? 'Ajustes de analítica' : 'Analytics settings';
  settings.addEventListener('click', () => {
    panel.hidden = false;
    panel.querySelector('button').focus();
  });
  (document.querySelector('footer') || document.body).append(settings);

  function cleanUrl(value) {
    try {
      const url = new URL(value);
      return url.origin + (url.origin === location.origin ? url.pathname : '/');
    } catch { return ''; }
  }
  function start() {
    if (started || blocked || !hosts.includes(location.hostname)) return;
    started = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    // Authored canonicals keep search text, chat prompts and arbitrary URL data out.
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    window.gtag('config', id, {
      page_location: cleanUrl(canonical || location.href),
      page_referrer: cleanUrl(document.referrer),
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_flags: 'SameSite=Lax;Secure',
    });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(tag);
  }
  // Opening WhatsApp or the phone app is inquiry intent, not a sent message or booking.
  let lastInquiry = { key: '', time: -Infinity };
  document.addEventListener('click', event => {
    if (event.defaultPrevented || (event.button !== undefined && event.button !== 0)) return;
    if (!started || blocked || choice !== 'granted' || !hosts.includes(location.hostname)) return;
    const link = event.target.closest('a[data-booking-inquiry]');
    if (!link) return;
    const method = link.dataset.bookingInquiry;
    const href = link.getAttribute('href') || '';
    if (method === 'whatsapp' ? !/^https:\/\/wa\.me\/50364441869(?:[?#]|$)/.test(href)
      : method === 'phone' ? href !== 'tel:+50364441869' : true) return;
    const section = link.closest('section')?.id;
    const placement = ['tours', 'victor', 'plan', 'contact', 'contacto', 'hero', 'itineraries'].includes(section)
      ? section : link.closest('nav') ? 'navigation' : 'page';
    const key = method + ':' + placement;
    const now = Date.now();
    if (lastInquiry.key === key && now - lastInquiry.time < 1000) return;
    lastInquiry = { key, time: now };
    window.gtag('event', 'booking_inquiry_started', {
      send_to: id, contact_method: method, contact_placement: placement,
      transport_type: 'beacon',
    });
  });
  function clearCookies() {
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.trim().split('=')[0];
      if (name !== '_ga' && !name.startsWith('_ga_')) continue;
      const domains = location.hostname.split('.');
      document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax; Secure';
      while (domains.length > 1) {
        document.cookie = name + '=; Max-Age=0; path=/; domain=.' + domains.join('.') + '; SameSite=Lax; Secure';
        domains.shift();
      }
    }
  }
  panel.addEventListener('click', event => {
    const button = event.target.closest('[data-analytics]');
    if (!button) return;
    choice = blocked ? 'denied' : button.dataset.analytics;
    try { localStorage.setItem(key, JSON.stringify({ value: choice, time: Date.now() })); } catch {}
    panel.hidden = true;
    if (choice === 'granted') start();
    else {
      window['ga-disable-' + id] = true;
      if (started) window.gtag('consent', 'update', { analytics_storage: 'denied' });
      clearCookies();
      if (started) location.reload();
    }
    settings.focus();
  });
  if (choice === 'granted') start();
  else clearCookies();
})();
