import { readdir,writeFile,readFile,appendFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export function staticSEO(site, preview=false){return {name:'demandlab-static-seo',hooks:{'astro:build:done':async({dir})=>{
 const output=fileURLToPath(dir);const lines=['User-agent: *','Allow: /'];const pages=[];
 async function walk(folder){for(const entry of await readdir(folder,{withFileTypes:true})){
  const file=path.join(folder,entry.name);
  if(entry.isDirectory()){await walk(file);continue;}
  if(preview && entry.name.endsWith('.html')){
   const html=(await readFile(file,'utf8')).replace(/<meta\s+name="robots"[^>]*>/g,'');
   const meta='<meta name="robots" content="noindex, nofollow">';
   await writeFile(file,html.includes('</head>')?html.replace('</head>',meta+'</head>'):html.replace('<title>',meta+'<title>'));
  }
  if(entry.name==='index.html'){const route=path.relative(output,path.dirname(file)).split(path.sep).join('/');if(route && /^[a-z]{2}(?:-[A-Z]{2})?$/.test(route.split('/')[0]))pages.push('/'+route+'/');}
 }}await walk(output);
 if(preview)await appendFile(path.join(output,'_headers'),'\n/*\n  X-Robots-Tag: noindex, nofollow\n');
 if(site && !preview){
 const escape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
 const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pages.sort().map(route=>'<url><loc>'+escape(new URL(route,site).href)+'</loc></url>').join('')+'</urlset>\n';
 await writeFile(path.join(output,'sitemap.xml'),xml);lines.push('Sitemap: '+new URL('/sitemap.xml',site).href);
 }await writeFile(path.join(output,'robots.txt'),lines.join('\n')+'\n');
}}};}
