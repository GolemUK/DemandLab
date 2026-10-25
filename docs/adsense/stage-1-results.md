# DemandLab — stage 1 results

**Updated:** 2026-10-25. **Status:** implementation and production build checks pass locally. Changes are prepared for Git review; production deployment is not yet confirmed.

## Article experience and card design

The article design system provides a shared header, responsive contents navigation, sources, related guides, checklists, callouts, procedural lists, comparison tables and figure support. Article text and navigation are rendered as static HTML. Article cards now use original inline SVG illustrations keyed to each topic category instead of secondary metadata. The card grid uses three columns on wide desktop, two on tablet, and one on narrow screens, with consistent artwork proportions, clipped text, focus visibility and reduced-motion support.

New reusable components are in `src/components/`: `ArticleHeader`, `ArticleTOC`, `ArticleFigure`, `InfoCallout`, `WarningCallout`, `StepByStep`, `ComparisonTable`, `ArticleChecklist`, `ArticleSources`, `RelatedArticles` and `GuideIllustration`.

## Content and routes

Eleven unique bilingual article pairs from the supplied content packets are published in the build (22 localized pages). The duplicate Google Storage candidate was excluded because the existing guide already covers the issue. The article prose was retained; only the redundant leading Markdown H1 was demoted to H2 because the page header supplies the single H1. Four authoring-only illustration notes and one editorial reminder were removed. Official source metadata was added, and source links were checked on 2026-10-25. No filler pages or fabricated authors/reviews were added.

Published route inventory and duplicate/source notes are in `stage-1-audit.md` and `content-packet-integration.md`. New diagrams supplied in the packets remain local SVGs in `public/assets/`; existing article diagrams remain under `public/images/`.

## Verification

- `npm run check`: passed with 0 errors, 0 warnings and 0 hints.
- `npm test`: passed, 9 test files and 70 tests.
- `SITE_URL=https://demandlab.com.ua npm run build:pages`: passed; 60 HTML files, 58 localized routes and 1,899 internal links checked with no errors.
- The production build generated localized static article pages, canonical/hreflang metadata, sitemap and robots output using the configured production origin.
- `npm audit --audit-level=high` could not reach the npm audit endpoint in this environment; dependency audit remains unverified here.

## Deployment status

No DNS, Cloudflare settings, or AdSense review were changed. The live site must be rechecked after the approved GitHub production-branch update and the Cloudflare Pages build completes. A successful local build does not establish that production has updated or that Google has indexed the new pages.
