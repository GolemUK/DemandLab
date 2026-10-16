import {it,expect} from 'vitest';
import {deploymentPolicy} from '../scripts/deployment.mjs';
it('blocks production without a confirmed origin',()=>{
  expect(()=>deploymentPolicy({CF_PAGES:'1',CF_PAGES_BRANCH:'main'})).toThrow();
});
it('does not infer a canonical from a deployment URL',()=>{
  expect(deploymentPolicy({CF_PAGES:'1',CF_PAGES_BRANCH:'feature',CF_PAGES_URL:'https://hash.project.pages.dev'})).toEqual({site:undefined,preview:true});
});
it('handles production branches and preview overrides',()=>{
  expect(deploymentPolicy({CF_PAGES:'1',CF_PAGES_BRANCH:'release',PRODUCTION_BRANCH:'release',SITE_URL:'https://confirmed.test/'})).toEqual({site:'https://confirmed.test',preview:false});
  expect(deploymentPolicy({DEPLOY_CONTEXT:'preview',SITE_URL:'https://confirmed.test'}).preview).toBe(true);
});
it('rejects unsafe Pages origins',()=>{
  for(const site of ['http://confirmed.test','https://confirmed.test/path','https://user:pass@confirmed.test','https://localhost']) expect(()=>deploymentPolicy({CF_PAGES:'1',CF_PAGES_BRANCH:'main',SITE_URL:site})).toThrow();
});
