import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { existsSync } from 'node:fs';
import {locales} from './src/i18n/locales.ts';
import { staticSEO } from './scripts/seo.mjs';
import { deploymentPolicy } from './scripts/deployment.mjs';
if (existsSync('.env')) process.loadEnvFile('.env');
const {site, preview} = deploymentPolicy(process.env);
if (site) { const url=new URL(site); if(!['https:','http:'].includes(url.protocol)||url.pathname!=='/'||url.search||url.hash||url.username||url.password)throw new Error('SITE_URL must be a real http(s) origin without a path, credentials, query or fragment'); }
export default defineConfig({ site: site || undefined, output: 'static', trailingSlash: 'always', i18n: { defaultLocale: 'uk', locales: [...locales], routing: { prefixDefaultLocale: true } }, integrations:[staticSEO(site, preview)], vite: { build: { assetsInlineLimit: 0 }, plugins: [tailwindcss()] } });

