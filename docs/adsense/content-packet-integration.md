# DemandLab content packet integration

**Imported and published in the production build:** 2026-10-25. Source ZIPs in `content-packets/inbox/` remain unchanged and are excluded from Git.

Eleven unique UK/EN pairs are integrated into Astro Content Collections. Each pair shares a translation key and has reciprocal locale routes, localized canonical/hreflang metadata, source metadata, and automatic sitemap inclusion. Publication and update dates reflect the integration date; the source-check date records the official-link verification performed on that date. The prose was preserved apart from technical heading hierarchy and removal of authoring notes that were not intended for readers.

| Pair | UK route | EN route | Packet |
|---|---|---|---|
| AI search visibility | `/uk/guides/ai-poshuk-vidymist-saitu/` | `/en/guides/ai-search-site-visibility/` | `DemandLab_4_New_Articles.zip` |
| Local AI on PC | `/uk/guides/lokalnyi-shi-na-pk/` | `/en/guides/local-ai-on-pc/` | `DemandLab_4_New_Articles.zip` |
| Passkeys | `/uk/guides/passkeys-bez-vtraty-dostupu/` | `/en/guides/passkeys-safe-setup/` | `DemandLab_4_New_Articles.zip` |
| Wi-Fi troubleshooting | `/uk/guides/povilnyi-wifi-mesh-wifi7/` | `/en/guides/wifi-troubleshooting-mesh-wifi7/` | `DemandLab_4_New_Articles.zip` |
| Diia documents | `/uk/guides/dokumenty-diia-ne-vidobrazhaiutsia/` | `/en/guides/diia-documents-not-showing/` | `demandlab_content_pack.zip` |
| Online store checks | `/uk/guides/perevirka-internet-mahazynu/` | `/en/guides/check-online-store-before-paying/` | `demandlab_content_pack.zip` |
| Search Console diagnosis | `/uk/guides/google-proskanuv-ne-indeksuie/` | `/en/guides/crawled-currently-not-indexed/` | `demandlab_content_pack.zip` |
| KEP troubleshooting | `/uk/guides/kep-ne-pratsiuie-diahnostyka/` | `/en/guides/ukraine-digital-signature-troubleshooting/` | `demandlab_last_4_articles.zip` |
| Windows after update | `/uk/guides/windows-11-povilna-pislia-onovlennia/` | `/en/guides/windows-11-slow-after-update/` | `demandlab_last_4_articles.zip` |
| Forms and Sheets workflow | `/uk/guides/google-forms-sheets-oblik-zaiavok/` | `/en/guides/google-forms-sheets-intake-workflow/` | `demandlab_last_4_articles.zip` |
| Phishing email check | `/uk/guides/pidozrilyi-lyst-yak-pereviryty/` | `/en/guides/verify-suspicious-email-safely/` | `demandlab_last_4_articles.zip` |

The `storage-triage` pair was excluded because it duplicates the existing, more complete Google Storage guide. Four SVG diagrams from the packets were copied unchanged into `public/assets/` and remain explanatory illustrations, not screenshots. Four author-only “suggested illustration” sections and the English local-AI editorial reminder were removed; no article claims were removed. The first Markdown H1 in each imported article was changed to H2 to leave one semantic H1 in the page template.

Official source links for the articles are stored in each document's `sources` metadata and displayed in the reusable source panel. The build creates published routes from this metadata and automatically includes the localized pages in the sitemap.
