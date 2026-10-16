# DemandLab

Static bilingual practical-solutions portal with Order Rescue, a browser-only CSV review tool.

## Requirements

Node.js 22.12+ (Node 24 LTS recommended), npm, and a modern browser supporting module Web Workers. No database, API server, accounts or paid services are needed.

## Install and run

~~~powershell
cd ".\DemandLab"
npm install
npm run dev
~~~

Open the URL printed by Astro (normally http://127.0.0.1:4321/uk/). The development server binds to loopback. English starts at /en/. To stop the server, press Ctrl+C.

For reproducible clean installs, use npm ci once package-lock.json matches package.json.

## Verify and build

~~~powershell
npm run check
npm test
npm run build
npm run verify:links
npm run verify:release
npm run preview
~~~

Vitest covers parsing, mapping, dates, aliases, all requested review rules, limits and safe CSV export. The link checker inspects built pages for broken internal links and anchors, language attributes, unique titles and descriptions. Browser checks are also required for the import-to-export workflow and small screens.

## Project layout

- src/i18n/: separate English and Ukrainian dictionaries.
- src/lib/: parsing, mapping, status/date normalization, deterministic analysis, export and Web Worker.
- src/scripts/order-rescue.ts: accessible DOM interaction and paginated report.
- src/content/guides/: separate Markdown guide translations.
- src/content.config.ts: Astro Content Collection schema and loader.
- src/pages/: localized static pages.
- src/components/ and src/layouts/: shared UI.
- public/samples/: UTF-8 example files.
- tests/: Vitest tests.
- scripts/seo.mjs: robots.txt and conditional sitemap generation.

## Contact links

Copy .env.example to .env. Set PUBLIC_TELEGRAM_URL and/or PUBLIC_VIBER_URL to the owner's real contact links. Telegram accepts HTTPS t.me or telegram.me links. Viber accepts viber: links or HTTPS invite.viber.com / vb.me links. Do not include example contact addresses in a production configuration.

Rebuild after changing configuration. Missing or rejected values show a non-clickable explanation. All commercial discussions, scope, prices and delivery are manual. There is no checkout, payment gateway, subscription or automatic delivery.

## Production URL and SEO

Set SITE_URL to the actual origin assigned to the deployment, without a path. .env is read by the Astro configuration; hosting environment variables also work. With SITE_URL set, canonical and hreflang links use it and the build writes sitemap.xml with only existing localized pages. Without it, no absolute canonical/hreflang URLs or sitemap are invented. robots.txt is generated in either case. Open Graph titles and descriptions are localized.

## Deploy to Cloudflare Pages

1. Run all checks and review npm audit before publishing.
2. Put the project in your Git repository, excluding node_modules, .env, logs and local caches.
3. In Cloudflare Pages, connect the repository and select the project directory as the root.
4. Build command: npm run build. Output directory: dist. Configure Node 24 using the hosting build environment.
5. Configure SITE_URL using the real Pages or custom domain and add the real contact links if available.
6. Deploy, then verify both languages, the worker, sample import, file import and report download on the actual URL.

The generated dist directory is also suitable for a manual static upload. No Cloudflare adapter, Functions or backend is needed. public/_headers configures security headers on Pages and public/_redirects sends the root path to /uk/.

No deployment is performed automatically by this repository.

## Editorial workflow and new languages

See [EDITORIAL.md](EDITORIAL.md) and templates/article.uk.md / templates/article.en.md for publication fields, sources, dates, translations, categories, search, and adding pl/de/cs. The site uses Astro Content Collections with Markdown.

## Order Rescue behavior

- UTF-8 with optional BOM; comma or semicolon delimiters; quoted and multiline fields.
- Maximum 5 MiB (5,242,880 bytes), 10,000 data records.
- Required mappings: ID, created date, fulfillment status. Ambiguous aliases are left blank and every mapping requires confirmation.
- Date-only YYYY-MM-DD, compared as calendar dates. Default reference date uses the browser's local calendar; demo uses 2026-10-15.
- Open orders are new or processing. Only these can be overdue for dispatch.
- Exact duplicates compare every parsed field; additional occurrences are counted. Repeated IDs are separate informational findings and may be valid line items.
- Shipped/unpaid means verify payment arrangement, not definite error. Missing deadlines are optional workflow warnings for open orders.
- Missing or invalid totals are not analyzed. Unknown fulfillment and payment values are flagged. No automatic corrections or deletions.
- Orders to review counts unique nonempty IDs plus each row missing an ID. The invalid-fields metric counts rows, and warnings count issues. Source row labels are logical CSV record numbers, including the header; multiline fields may span physical lines.
- Export always includes the complete issue report, irrespective of display filters. It includes no unrelated customer fields. Leading spreadsheet formulas and control characters are neutralized with an apostrophe, and CSV quoting is applied.
- Data lives in memory. Clear data terminates the worker and clears the report. Page refresh/close discards it. Downloaded files remain on the user's device.

## Limits and Stage 2

This is an operational review aid, not an accounting or inventory system. It cannot establish every business problem. Unsupported date formats require correction in the source file. A real domain and owner contact links must be supplied by the owner. No legal compliance certification is claimed.

Stage 2 should start only after Stage 1 acceptance: review anonymized real-world CSV formats, improve aliases from observed examples, and choose further tools based on actual workflow needs. Stage 2 is not implemented here.

## Final release

See [FINAL_RELEASE_REPORT.md](FINAL_RELEASE_REPORT.md) for actual checks, limitations and the exact release procedure. npm run preview:production starts a local-only server on port 4322 with the configured static security headers and 404 behavior. It is a QA helper, not a server to deploy.

Advertising is disabled centrally in src/config/advertising.ts. AdSlot renders nothing. Adding a provider requires a separate approved change, real identifiers and privacy/consent review.

## Автоматический деплой
Основная инструкция: [DEPLOYMENT.md](DEPLOYMENT.md). Команда Cloudflare Pages: npm run build:pages; output: dist. Итоговый аудит: [FINAL_RELEASE_REPORT.md](FINAL_RELEASE_REPORT.md).


