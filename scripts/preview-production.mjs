import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';import path from 'node:path';
const root=path.resolve('dist');const groups=[];let current;
for(const line of (await readFile(path.join(root,'_headers'),'utf8')).split(/\r?\n/)){if(!line.trim())continue;if(!line.startsWith(' ')){current={route:line.trim(),headers:{}};groups.push(current)}else{const at=line.indexOf(':');if(at>0)current.headers[line.slice(0,at).trim()]=line.slice(at+1).trim()}}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.csv':'text/csv; charset=utf-8','.xml':'application/xml','.txt':'text/plain'};
http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);for(const group of groups){if(group.route==='/*'||pathname.startsWith(group.route.replace(/\*$/,'')))for(const [key,value] of Object.entries(group.headers))res.setHeader(key,value)}
if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return}if(pathname==='/'){res.writeHead(301,{Location:'/uk/'});res.end();return}
let file=path.resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}let status=200;
try{if((await stat(file)).isDirectory()){if(!pathname.endsWith('/')){res.writeHead(308,{Location:pathname+'/'});res.end();return}file=path.join(file,'index.html')}await stat(file)}catch{file=path.join(root,'404.html');status=404}
res.writeHead(status,{'Content-Type':mime[path.extname(file)]??'application/octet-stream'});res.end(req.method==='HEAD'?undefined:await readFile(file));}catch{res.writeHead(400);res.end('Bad request')}}).listen(4322,'127.0.0.1',()=>console.log('Production-header QA: http://127.0.0.1:4322'));
