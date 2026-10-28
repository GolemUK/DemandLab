# Incoming editorial packages

Original ZIPs received from the editor are preserved unchanged in this folder. The 2026-10-25 content packets have been integrated and published in the current local production build; see `../../docs/adsense/content-packet-integration.md` for the route inventory and technical adaptations.

For future packets, inspect each archive separately, compare topics with existing guides, and integrate distinct UK/EN pairs into `src/content/guides/{uk,en}/`. Do not create empty public routes. Use a shared `translationKey`, distinct locale-specific slugs and source metadata; verify claims, source links, locale metadata, internal links and local assets before publication. Dates must reflect actual publication, update and source checks.

Illustrations may be SVG or WebP under `public/assets/` or `public/images/`. Use descriptive localized alt text and reserve intrinsic dimensions to prevent layout shift. Never present a schematic as a product screenshot. Preserve editor wording except for necessary technical adaptations, and record those changes. Keep duplicate topics out of the public collection.
