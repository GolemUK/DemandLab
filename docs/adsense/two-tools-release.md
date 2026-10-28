# DemandLab release — bilingual production tools

**Date:** 2026-10-28  
**Commit:** `4ecb650` on `adsense-ads-txt`  
**Status:** Local checks pass; waiting for protected-branch review and production deployment.

## Delivered

- Added `/uk/tools/profit-calculator/` and `/en/tools/profit-calculator/`. The calculator models per-unit costs, fixed and percentage payment fees, a manually entered tax rate on revenue, desired margin, planned quantity and period fixed costs. It shows per-unit and period profit, margin, markup, a break-even estimate and target-price scenarios. Currency selection changes formatting only; it does not convert amounts. The page labels calculations as estimates.
- Added `/uk/tools/image-optimizer/` and `/en/tools/image-optimizer/`. JPEG, PNG and WebP images are resized/re-encoded in the browser; batch output can be downloaded individually or as ZIP. Source image data is not sent to a server. Limits are 20 MiB per file, 10 files, 80 MiB per batch, 40 megapixels per image, and 100 MiB of output. PNG retains alpha; JPEG uses the selected background. Re-encoding may remove metadata.
- Linked the tools from the home page and tools directory, added them to site search and software schema, and linked the calculator from the order tracking guides.
- Expanded the SEO validator to validate structured data for all free tools.

## Verification

- `npm run check`: 0 errors, warnings or hints.
- `npm test`: 11 test files, 89 tests passed.
- `SITE_URL=https://demandlab.com.ua npm run build:pages`: passed; 64 static pages built, 62 localized pages reachable, 2,013 internal links checked, release and SEO validators report zero errors. Sitemap contains the generated localized routes and paired hreflang/canonicals.
- `git diff --check`: passed.

## Publication

Pushed commit `4ecb650` to `origin/adsense-ads-txt`. The production branch `main` is protected, so the changes need to pass GitHub Actions and merge through a pull request before Cloudflare Pages can publish them. No DNS, Cloudflare zone settings, paid services, AdSense review, or production configuration were changed. Live deployment has not yet been verified.
