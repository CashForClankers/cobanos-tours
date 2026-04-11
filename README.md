# Los Cobanos Tours

Public marketing site and content repo for `https://los-cobanos.com/`.

The site is a lightweight static build focused on Los Cobanos tours, snorkeling, whale watching, reef guides, and bilingual visitor information for English and Spanish readers.

## Live site

- Production: `https://los-cobanos.com/`
- Spanish homepage: `https://los-cobanos.com/es/`

## Repo structure

- `index.html`: main English landing page
- `es/`: Spanish pages
- `styles.css`: shared site styling
- `docs/`: source notes, citations, and promotion docs
- `tests/`: fast content and SEO checks
- `e2e/`: Playwright smoke coverage
- `scripts/`: linting, build, and submission utilities

## Local workflow

Install dependencies:

```bash
npm install
```

Run the core checks:

```bash
npm run check
```

Run browser smoke tests:

```bash
npm run test:e2e
```

Serve the built output locally:

```bash
npm run build
npm run serve:dist
```

## Publishing notes

- The canonical production domain is `https://los-cobanos.com/`.
- `CNAME`, `robots.txt`, sitemap entries, and canonical tags should stay aligned to that domain.
- If repo metadata is updated on GitHub, use the live site URL as the homepage.

## Content notes

- Keep contact details, meeting-point coordinates, and booking links current.
- Preserve the bilingual English and Spanish paths when editing navigation.
- Keep factual claims traceable to files under `docs/`.
