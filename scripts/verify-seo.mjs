import {readFile,readdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {deploymentPolicy} from './deployment.mjs';
if(existsSync('.env'))process.loadEnvFile('.env');
const {site,preview}=deploymentPolicy(process.env);
const pages=new Map(),errors=[],titles=new Set(),descriptions=new Set();
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){
 const file=path.join(dir,e.name);if(e.isDirectory()){await walk(file);continue;}
 if(!file.endsWith('index.html'))continue;
 const route='/'+path.relative('dist',file).replaceAll('\\','/').replace(/index.html$/,'');
 if(route==='/')continue;
 const html=await readFile(file,'utf8'),links=[...html.matchAll(/<link\b[^>]*>/g)].map(m=>attrs(m[0]));
 const anchors=[...html.matchAll(/<a\b[^>]*>/g)].map(m=>attrs(m[0]));
 pages.set(route,{html,links,anchors});
}}
await walk('dist');
for(const [route,{html,links,anchors}] of pages){
 const fail=message=>errors.push(route+': '+message),lang=route.split('/')[1];
 if(!/^\/[a-z]{2}(?:-[A-Z]{2})?\//.test(route)||!html.includes('lang="'+lang+'"'))fail('invalid localized route/lang');
 const title=[...html.matchAll(/<title>(.*?)<\/title>/gs)];
 if(title.length!==1||!title[0][1].trim()||titles.has(title[0][1]))fail('missing or duplicate title');else titles.add(title[0][1]);
 const metas=[...html.matchAll(/<meta\b[^>]*>/g)].map(m=>attrs(m[0]));
 const desc=metas.filter(m=>m.name==='description');
 if(desc.length!==1||!desc[0].content?.trim()||descriptions.has(desc[0].content))fail('empty or duplicate description');else descriptions.add(desc[0].content);
 const canon=links.filter(l=>l.rel==='canonical');
 if(canon.length!==(site?1:0)||site&&canon[0]?.href!==site+route)fail('duplicate/missing/wrong canonical');
 if(!preview&&metas.some(m=>m.name==='robots'&&/noindex|nofollow/.test(m.content)))fail('unexpected robots restriction');
 if((html.match(/<h1(?:\s|>)/g)||[]).length!==1)fail('one H1 required');
 if(!/<main\b[^>]*>[\s\S]*<h1/.test(html))fail('main content absent in HTML');
 const alternates=links.filter(l=>l.rel==='alternate'&&l.hreflang),seen=new Set();
 for(const alt of alternates){
  if(seen.has(alt.hreflang))fail('duplicate hreflang');seen.add(alt.hreflang);
  let u;try{u=new URL(alt.href)}catch{fail('invalid hreflang URL');continue;}
  const dest=pages.get(u.pathname);
  if(!site||u.origin!==new URL(site).origin||!dest||u.pathname.split('/')[1]!==alt.hreflang){fail('wrong hreflang destination');continue;}
  if(!dest.links.some(l=>l.rel==='alternate'&&l.hreflang===lang&&l.href===site+route))fail('hreflang missing reciprocal link');
 }
 if(site&&!alternates.some(l=>l.hreflang===lang&&l.href===site+route))fail('missing self hreflang');
 for(const a of anchors)if(a.href?.startsWith('/')&&/nofollow/.test(a.rel||''))fail('internal nofollow');
 for(const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)){
  try{const d=JSON.parse(match[1]);if(d['@context']!=='https://schema.org'||!d['@type'])fail('invalid schema context/type');
   if(d['@type']==='Article'&&(!d.headline||!d.datePublished||!d.dateModified||d.mainEntityOfPage!==site+route||d.dateModified<d.datePublished))fail('invalid Article');
   if(d['@type']==='BreadcrumbList'&&(!Array.isArray(d.itemListElement)||d.itemListElement.some((x,i)=>x.position!==i+1||!x.name||!pages.has(new URL(x.item).pathname))))fail('invalid BreadcrumbList');
   if(d['@type']==='WebSite'&&(!d.name||d.url!==site+'/'))fail('invalid WebSite');
   if(d['@type']==='SoftwareApplication'&&(!route.includes('/tools/')||route==='/uk/tools/'||route==='/en/tools/'||d.url!==site+route||!d.name||!d.applicationCategory||d.isAccessibleForFree!==true))fail('invalid application');
  }catch{fail('malformed JSON-LD');}
 }
}
const visited=new Set(),queue=[...pages.keys()].filter(r=>/^\/[a-z]{2}\/$/.test(r));
while(queue.length){const r=queue.shift();if(visited.has(r))continue;visited.add(r);for(const a of pages.get(r)?.anchors||[]){const dest=a.href?.split(/[?#]/)[0];if(pages.has(dest)&&!visited.has(dest))queue.push(dest);}}
for(const r of pages.keys())if(!visited.has(r))errors.push(r+': unreachable from home');
console.log(JSON.stringify({site:site??null,preview,pages:[...pages.keys()],reachable:visited.size,errors},null,2));
if(errors.length)process.exitCode=1;
