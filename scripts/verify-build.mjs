import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');const pages=[];
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await walk(file);else if(entry.name.endsWith('.html'))pages.push(file);}}
await walk(root);const errors=[];const titles=new Map();let links=0;
for(const file of pages){const html=await readFile(file,'utf8');const relative=path.relative(root,file).replaceAll('\\','/');if(!/^[a-z]{2}(?:-[A-Z]{2})?\//.test(relative))continue;
 const locale=relative.split('/')[0];if(!html.includes('lang="'+locale+'"'))errors.push(relative+': wrong HTML language');
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1];if(!title)errors.push(relative+': missing title');else if(titles.has(title))errors.push(relative+': duplicate title');else titles.set(title,relative);
 if(!/<meta[^>]+name="description"[^>]+content="[^" ]/.test(html))errors.push(relative+': missing description');
 if((html.match(/<h1(?:\s|>)/g)||[]).length!==1)errors.push(relative+': must have one h1');
 for(const match of html.matchAll(/(?:href|src)="([^"<>]+)"/g)){const url=match[1];if(!url.startsWith('/')&&!url.startsWith('#'))continue;links++;const [route,fragment]=url.split('#');let target=route?path.join(root,decodeURIComponent(route.split('?')[0])):file;if(route.endsWith('/'))target=path.join(target,'index.html');try{if(!(await stat(target)).isFile())throw Error('not a file');if(fragment && /\.html$/.test(target)){const destination=await readFile(target,'utf8');if(!destination.includes('id="'+fragment+'"'))errors.push(relative+': missing anchor '+url);}}catch{errors.push(relative+': broken link '+url);}}
}
console.log(JSON.stringify({pages:pages.length,localizedPages:titles.size,checkedLinks:links,errors},null,2));if(errors.length)process.exitCode=1;
