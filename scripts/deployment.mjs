export function deploymentPolicy(env) {
  const cloudflare = env.CF_PAGES === '1';
  const branch = env.PRODUCTION_BRANCH || 'main';
  const preview = env.DEPLOY_CONTEXT === 'preview' || (cloudflare && env.CF_PAGES_BRANCH !== branch);
  const site = env.SITE_URL?.trim().replace(/\/$/, '') || undefined;
  if (cloudflare && !preview && !site) throw new Error('Production requires SITE_URL: the confirmed public HTTPS origin');
  if (cloudflare && site) {
    const url = new URL(site);
    if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password || !url.hostname.includes('.') || /^(localhost|127\.)/.test(url.hostname)) throw new Error('Pages SITE_URL must be a public HTTPS origin');
  }
  return { site, preview };
}
