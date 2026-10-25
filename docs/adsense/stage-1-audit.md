# DemandLab — AdSense stage 1 content and route audit

**Audit date:** 2026-10-25
**Scope:** repository routes, editorial content and static build. No deployment or AdSense resubmission was performed.

## Public route inventory

The production build generates 58 localized HTML routes (29 UK and 29 EN), plus the root redirect and the 404 document. The root, 404, `robots.txt`, sitemap files and static assets are system resources rather than indexable editorial pages.

| Type | UK | EN | Notes |
| --- | --- | --- | --- |
| Home | `/uk/` | `/en/` | Editorial home, not a placeholder |
| Guides directory | `/uk/guides/` | `/en/guides/` | Lists published guides |
| Published guides (15 per locale; see `content-packet-integration.md` for the complete new-route list) | `/uk/guides/oblik-zamovlen-bez-crm/` · `/uk/guides/pereviryty-dozvoly-zastosunkiv-android/` · `/uk/guides/skhovyshche-google-zapovnene/` · `/uk/guides/yak-zvilnyty-mistse-na-dysku-c-windows/` | `/en/guides/order-tracking-without-crm/` · `/en/guides/check-android-app-permissions/` · `/en/guides/google-storage-still-full/` · `/en/guides/free-up-space-c-drive-windows/` | Four language pairs |
| Topics (4 per locale) | `/uk/topics/business/` · `/uk/topics/mobile/` · `/uk/topics/technology/` · `/uk/topics/windows/` | `/en/topics/business/` · `/en/topics/mobile/` · `/en/topics/technology/` · `/en/topics/windows/` | Generated only for categories with published guides; empty AI category has no route |
| Search | `/uk/search/` | `/en/search/` | Searches published content in the current locale |
| Tools directory and Order Rescue | `/uk/tools/` · `/uk/tools/order-rescue/` | `/en/tools/` · `/en/tools/order-rescue/` | Existing working tool retained |
| Business solutions | `/uk/solutions/` | `/en/solutions/` | Business-service direction |
| About, contact and privacy | `/uk/about/` · `/uk/contact/` · `/uk/privacy/` | `/en/about/` · `/en/contact/` · `/en/privacy/` | Static informational/legal pages |

## Existing content

There are eight published guide documents: order tracking without a CRM, Google storage diagnosis, freeing Windows drive space and reviewing Android app permissions, each in UK and EN. The files contain substantive introductions, multiple explanatory sections, practical steps, limitations or safety notes where appropriate, source links and related links. Approximate body sizes range from 633 to 1,141 whitespace-separated tokens; this is descriptive only and not a quality threshold. No bulk-generated articles or empty topic indexes were found. `templates/article.uk.md` and `templates/article.en.md` include editorial placeholders by design and are not part of the public collection.

All eight guides are rendered into static HTML, so the article text, headings, source links, figures and table content are present without JavaScript. Search enhancement uses a small client script, but it is not required to read the published material. The existing Order Rescue route and localized navigation remain in the route set.

## Technical findings

- Each article has one H1, a unique title and description, category/tags, publication and update dates, source-check date, sources, and a distinct locale slug.
- The shared article layout emits canonical URLs when `SITE_URL` is supplied and reciprocal language alternates for paired pages. Static routes are generated from `published: true` entries.
- `scripts/seo.mjs` builds `sitemap.xml` from actual localized `index.html` output, creates `sitemap-index.xml`, and references the sitemap in `robots.txt` for production builds. It excludes preview deployments from indexing. `scripts/verify-release.mjs` checks that sitemap URLs match the built published routes.
- The current production-mode build checked 1,899 internal links with no errors. Production verification requires `SITE_URL`; the local build without this origin intentionally does not emit canonical or production sitemap files.
- Read-only browser comparison confirmed the live Google storage article has the expected canonical URL, `lang="uk"` and reciprocal UK/EN hreflang links. The published `sitemap.xml` contains 34 localized routes; `robots.txt` points to it, and `sitemap-index.xml` points to `sitemap.xml`. The live article still reports its earlier 2026-10-19 update and lacks the new local callout classes, so production is an earlier revision than this un-deployed checkout. Response headers and the entire site were not crawled. No DNS, Cloudflare or production settings were changed.
- A repository-wide placeholder scan found only the expected non-public article-template prompts and ordinary search input placeholders. No public article stubs were found.

## UX and media observations

Before this stage, guide pages shared the site theme but had limited navigation hierarchy within long articles; the four topics of illustration coverage were uneven. There were no image dimensions in the content schema, and the new article body styles needed a reliable build-time mapping from Markdown constructs to callout, ordered-step and comparison-table classes. Tables need horizontal scrolling on narrow screens; the contents list should collapse on mobile. These items are addressed in the stage results.

## Content packet publication (2026-10-25)

Eleven unique bilingual pairs from the supplied archives are published alongside the four existing pairs, for 15 article pages per locale. Their localized routes are listed in `content-packet-integration.md`. The Google Storage duplicate was excluded. All 58 localized pages are generated as static HTML and included in the production sitemap build. The original source archives remain unmodified.
