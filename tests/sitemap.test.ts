import {it,expect} from 'vitest';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {staticSEO} from '../scripts/seo.mjs';

for(const preview of [false,true])it(`generates consistent XML and robots for ${preview?'preview':'production'}`,async()=>{
  const root=await mkdtemp(path.join(tmpdir(),'demandlab-sitemap-'));
  try{
    for(const route of ['uk','en','uk/guides/example','internal']){
      await mkdir(path.join(root,route),{recursive:true});
      await writeFile(path.join(root,route,'index.html'),'<html><head></head><body></body></html>');
    }
    await writeFile(path.join(root,'_headers'),'/*\n  X-Content-Type-Options: nosniff\n');
    await writeFile(path.join(root,'404.html'),'<html><head></head></html>');
    await staticSEO('https://demandlab.com.ua',preview).hooks['astro:build:done']({dir:pathToFileURL(root+path.sep)});
    const robots=await readFile(path.join(root,'robots.txt'),'utf8');
    expect(robots).toContain('Allow: /');
    if(preview){
      await expect(readFile(path.join(root,'sitemap.xml'))).rejects.toThrow();
      await expect(readFile(path.join(root,'sitemap-index.xml'))).rejects.toThrow();
      expect(robots).not.toContain('Sitemap:');
      expect(await readFile(path.join(root,'en/index.html'),'utf8')).toContain('noindex, nofollow');
    }else{
      const xml=await readFile(path.join(root,'sitemap.xml'),'utf8');
      expect([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1])).toEqual(['https://demandlab.com.ua/en/','https://demandlab.com.ua/uk/','https://demandlab.com.ua/uk/guides/example/']);
      expect(await readFile(path.join(root,'sitemap-index.xml'),'utf8')).toContain('<loc>https://demandlab.com.ua/sitemap.xml</loc>');
      expect(robots).toContain('Sitemap: https://demandlab.com.ua/sitemap.xml');
    }
  }finally{await rm(root,{recursive:true,force:true});}
});
