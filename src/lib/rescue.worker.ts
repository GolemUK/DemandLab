/// <reference lib="webworker" />
import { parseCSV, checkSize, InputError } from './parser';
import { suggestMapping } from './mapping';
import { analyze } from './analyze';
import type { ParsedCSV, Mapping } from './types';
let data:ParsedCSV|null=null;
self.onmessage=async (event:MessageEvent<{type:string;file?:File;text?:string;mapping?:Mapping;reference?:string;warn?:boolean}>)=>{
 try {
 const message=event.data;
 if(message.type==='parse') {
  data=null; let text=message.text??'';
  if(message.file) { checkSize(message.file.size); try { text=new TextDecoder('utf-8',{fatal:true}).decode(await message.file.arrayBuffer()); } catch { throw new InputError('encoding'); } }
  data=parseCSV(text); self.postMessage({type:'parsed',headers:data.headers,total:data.rows.length,mapping:suggestMapping(data.headers)});
 } else if(message.type==='analyze') { if(!data||!message.mapping)throw new InputError('mapping'); self.postMessage({type:'report',report:analyze(data,message.mapping,message.reference??'',message.warn)}); }
 } catch(error) { self.postMessage({type:'error',code:error instanceof InputError?error.code:'worker'}); }
};
