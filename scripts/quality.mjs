import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {deploymentPolicy} from './deployment.mjs';
if (existsSync('.env')) process.loadEnvFile('.env');
const policy = deploymentPolicy(process.env);
if (policy.preview) process.env.DEPLOY_CONTEXT = 'preview';
const steps = [
  ['node_modules/astro/bin/astro.mjs', 'check'],
  ['node_modules/vitest/vitest.mjs', 'run'],
  ['node_modules/astro/bin/astro.mjs', 'build'],
  ['scripts/verify-build.mjs'],
  ['scripts/verify-release.mjs'],
  ['scripts/verify-seo.mjs'],
];
for (const args of steps) {
  const result = spawnSync(process.execPath, args, {stdio:'inherit', env:process.env});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
