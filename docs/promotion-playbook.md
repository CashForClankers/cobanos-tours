# Promotion Playbook

This repo now covers the on-site SEO foundation. The remaining promotion work should stay as lightweight as possible and focus on channels with real travel intent.

## Priority stack

1. Google Business Profile
2. Google Search Console
3. TripAdvisor listing
4. Official tourism or registry listings
5. A small number of high-quality community posts

The goal is not to open many accounts. The goal is to create a few durable discovery surfaces that can keep driving branded and non-branded search.

## What is already done in the site

- Canonical domain: `https://los-cobanos.com/`
- XML sitemap: `https://los-cobanos.com/sitemap.xml`
- English-primary landing pages for snorkeling, whale watching, reef planning, and day-trip intent
- Dedicated Spanish URL: `https://los-cobanos.com/es/`
- Search-friendly internal linking between the main pages
- `google-site-verification.html` is checked in so Search Console verification only needs Google’s token pasted into that file
- IndexNow key file is published so updated URLs can be pushed to Bing and Yandex without opening additional accounts

## Search intent to target

- `Los Cobanos snorkeling`
- `snorkeling El Salvador`
- `whale watching El Salvador`
- `Los Cobanos day trip from San Salvador`
- `nature tours El Salvador Pacific coast`
- `swimming beaches El Salvador`
- `surf trip El Salvador snorkeling day`
- `Los Cobanos scuba`
- `Los Cobanos reef tour`

## Minimal manual steps

### 1. Submit the domain to Google Search Console

- Add property: `https://los-cobanos.com/`
- Submit sitemap: `https://los-cobanos.com/sitemap.xml`
- Watch which queries start impressions first.
- If Google asks for HTML-file verification, replace the placeholder contents of `google-site-verification.html` with the exact token they provide and redeploy.

### 1.5. Re-submit changed URLs through IndexNow

- Run `npm run submit:indexnow` after major content changes or new landing pages are deployed.
- This notifies IndexNow-compatible engines such as Bing and Yandex using the live sitemap URLs.

### 2. Create or tighten the Google Business Profile

Use the business exactly as:

- Name: `Los Cóbanos Tours`
- Website: `https://los-cobanos.com/`
- Primary phone: `+503 6444 1869`
- Category options to test:
  - `Tour operator`
  - `Tourist attraction`
  - `Boat tour agency`

Suggested short description:

`Local snorkeling, whale-watching, and nature trips in Los Cóbanos, El Salvador. Contact Victor directly in English or Spanish for reef conditions, meeting point, and cash or Bitcoin payment.`

### 3. TripAdvisor listing copy

Suggested summary:

`Los Cóbanos Tours helps travelers explore one of El Salvador's best-known reef and coastal nature areas with Victor, a friendly local guide who has his own boat and works with a captain carrying the government-required whale-watching license. Ideal for snorkeling, wildlife days, ocean swimming, and broader Pacific coast itineraries.`

### 4. One useful Reddit or Facebook post

Do not sound like an ad. Use practical trip-planning framing.

Draft:

`If you're planning an El Salvador coast trip and want something beyond surfing, Los Cóbanos is a good stop for snorkeling, wildlife, and reef swimming. I'm helping run a local guide site there with meeting-point details, season notes, and direct WhatsApp contact for Victor, who speaks English and Spanish. Happy to answer logistics questions about the area. https://los-cobanos.com/`

## Lightweight partnership outreach

These are low-volume, high-fit outreach targets:

- hostels in San Salvador
- surf camps on the Pacific coast
- boutique hotels in Sonsonate / Ruta de las Flores
- local tourism bloggers or newsletter writers

### Short email template

Subject:
`Los Cóbanos snorkeling and nature day-trip option for your guests`

Body:

`Hi — I'm sharing a local option for guests who want a Pacific coast nature day in El Salvador, especially travelers looking for snorkeling, whale watching, swimming, or a reef stop alongside a surf itinerary. The site is https://los-cobanos.com/ and the direct guide contact is Victor, who speaks English and Spanish, has his own boat, and coordinates visitors by WhatsApp. If this fits your guest recommendations, we'd be glad to be included as a Los Cóbanos option.`

## Review collection

Ask past customers for:

- 1 short Google review
- 1 TripAdvisor review
- 1 photo if they are willing

Even a small number of reviews materially improves map and directory credibility in low-competition destinations.

## What to avoid

- mass directory submissions
- paid SEO retainers
- posting the same promotional message everywhere
- making up public prices that may go stale
- promising wildlife sightings

## Search architecture notes

- Google’s multilingual guidance is a good reason to keep English and Spanish on separate URLs where possible instead of relying only on in-page toggles.
- Google’s image SEO guidance is a good reason to keep real crawlable images with descriptive alt text on the key landing pages.
