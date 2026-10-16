// No network requests, scripts, IDs or visible placeholders. Enabling an ad provider
// requires owner approval, privacy/consent review and a separate implementation.
export const advertising = { enabled: false, placements: ['article-after-content','home-after-articles'] } as const;
export type AdPlacement = typeof advertising.placements[number];
