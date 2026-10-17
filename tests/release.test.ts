import {it,expect} from 'vitest';import en from '../src/i18n/en';import uk from '../src/i18n/uk';import {readFileSync} from 'node:fs';
function keys(value:unknown,prefix=''):string[]{return Object.entries(value as Record<string,unknown>).flatMap(([key,v])=>typeof v==='object'&&!Array.isArray(v)?keys(v,prefix+key+'.'):[prefix+key]).sort()}
it('has matching UK/EN interface keys',()=>expect(keys(uk)).toEqual(keys(en)));
it('does not enable advertising or publish fictional publisher IDs',()=>{expect(readFileSync('src/config/advertising.ts','utf8')).toContain('enabled: false');expect(readFileSync('public/_headers','utf8')).not.toContain("script-src 'self' 'unsafe-inline'")});

it('ships HTTPS and browser isolation safeguards without forcing unrelated subdomains',()=>{
  const headers=readFileSync('public/_headers','utf8');
  expect(headers).toContain('Strict-Transport-Security: max-age=2592000');
  expect(headers).not.toContain('includeSubDomains');
  expect(headers).not.toContain('preload');
  expect(headers).toContain('Cross-Origin-Opener-Policy: same-origin');
  expect(headers).toContain("frame-ancestors 'none'");
  expect(headers).toContain("object-src 'none'");
});
