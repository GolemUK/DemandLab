import {describe,it,expect,vi} from 'vitest';
import {MAX_IMAGE_BYTES,MAX_IMAGE_COUNT,MAX_OUTPUT_BYTES,createStoredZip,optimizeImage,outputFileName,resizeDimensions,validateImageBatch,validateImageFile,type CanvasLike,type ImageRuntime} from '../src/lib/image-optimizer';

function fixture(options:{mime?:string;outputMime?:string;outputSize?:number|null}={}){
  const calls:string[]=[];let closed=0;let canvasSize=0;
  const context={imageSmoothingEnabled:false,imageSmoothingQuality:'low' as ImageSmoothingQuality,fillStyle:'',fillRect:vi.fn(()=>calls.push('fill')),drawImage:vi.fn(()=>calls.push('draw'))} as unknown as CanvasRenderingContext2D;
  const canvas:CanvasLike={width:0,height:0,getContext:()=>context,toBlob(callback,type){canvasSize=this.width*this.height;const mime=options.outputMime??type;callback(options.outputSize===null?null:new Blob([new Uint8Array(options.outputSize??20)],{type:mime}));}};
  const runtime:ImageRuntime={decode:vi.fn(async()=>({width:400,height:200,close(){closed++}})),createCanvas:vi.fn((w,h)=>{canvas.width=w;canvas.height=h;return canvas;})};
  const file=new File([new Uint8Array(100)],'photo.png',{type:options.mime??'image/png'});
  return {file,runtime,context,calls,get closed(){return closed},get canvasSize(){return canvasSize},canvas};
}
const opts={width:200,height:200,preserveAspectRatio:true,format:'webp' as const,quality:.82,background:'#ffffff'};

describe('browser image optimizer core',()=>{
  it('accepts a single image and validates a batch of supported files',()=>{
    expect(validateImageFile({type:'image/jpeg',size:12})).toBeNull();
    expect(validateImageBatch([{type:'image/png',size:10},{type:'image/webp',size:20}])).toBeNull();
    expect(validateImageBatch(Array.from({length:MAX_IMAGE_COUNT+1},()=>({type:'image/png',size:1})))).toBe('count');
  });
  it('rejects unsupported, empty, oversized and oversized batches',()=>{
    expect(validateImageFile({type:'image/avif',size:5})).toBe('type');
    expect(validateImageFile({type:'image/png',size:0})).toBe('empty');
    expect(validateImageFile({type:'image/png',size:MAX_IMAGE_BYTES+1})).toBe('size');
    expect(validateImageBatch(Array.from({length:5},()=>({type:'image/png',size:17*1024*1024})))).toBe('batch-size');
  });
  it('resizes to fit inside dimensions and preserves proportions',()=>expect(resizeDimensions({width:400,height:200},{width:200,height:200,preserveAspectRatio:true})).toEqual({width:200,height:100}));
  it('handles a single constrained dimension and rejects too many pixels',()=>{
    expect(resizeDimensions({width:400,height:200},{width:100,height:0,preserveAspectRatio:true})).toEqual({width:100,height:50});
    expect(()=>resizeDimensions({width:10000,height:10000},{width:10000,height:10000,preserveAspectRatio:false})).toThrow('pixels');
  });
  it('converts to the requested output type, names the output and closes browser memory',async()=>{
    const f=fixture();const output=await optimizeImage(f.file,opts,f.runtime);
    expect(output.blob.type).toBe('image/webp');expect(output.name).toBe('photo.webp');expect(output.width).toBe(200);expect(output.height).toBe(100);expect(output.savedPercent).toBe(80);expect(f.closed).toBe(1);expect(f.canvas.width).toBe(0);
  });
  it('keeps alpha for PNG exports and uses the chosen background for JPEG',async()=>{
    const png=fixture();await optimizeImage(png.file,{...opts,format:'png'},png.runtime);expect(png.context.fillRect).not.toHaveBeenCalled();
    const jpeg=fixture();await optimizeImage(jpeg.file,{...opts,format:'jpeg',background:'#aabbcc'},jpeg.runtime);expect(jpeg.context.fillRect).toHaveBeenCalledOnce();expect(jpeg.context.fillStyle).toBe('#aabbcc');expect(jpeg.calls.indexOf('fill')).toBeLessThan(jpeg.calls.indexOf('draw'));
  });
  it('reports larger outputs instead of promising savings',async()=>{
    const f=fixture({outputSize:120});const output=await optimizeImage(f.file,opts,f.runtime);expect(output.savedPercent).toBe(-20);
  });
  it('reports decode, encode and unsupported format errors while still releasing resources',async()=>{
    const decode=fixture();vi.mocked(decode.runtime.decode).mockRejectedValueOnce(new Error('bad image'));await expect(optimizeImage(decode.file,opts,decode.runtime)).rejects.toThrow();
    const encode=fixture({outputSize:null});await expect(optimizeImage(encode.file,opts,encode.runtime)).rejects.toThrow('encode');expect(encode.closed).toBe(1);expect(encode.canvas.width).toBe(0);
    const unsupported=fixture({outputMime:'image/png'});await expect(optimizeImage(unsupported.file,opts,unsupported.runtime)).rejects.toThrow('format-unsupported');
  });
  it('creates a valid ZIP container for multiple downloads and rejects empty/oversized batches',async()=>{
    const zip=await createStoredZip([{name:'first.webp',blob:new Blob(['one'])},{name:'second.png',blob:new Blob(['two'])}]);
    const bytes=new Uint8Array(await zip.arrayBuffer());expect(zip.type).toBe('application/zip');expect([...bytes.slice(0,4)]).toEqual([0x50,0x4b,0x03,0x04]);expect(new TextDecoder().decode(bytes)).toContain('first.webp');expect(new TextDecoder().decode(bytes)).toContain('second.png');
    await expect(createStoredZip([])).rejects.toThrow('empty-zip');
    await expect(createStoredZip([{name:'huge.bin',blob:new Blob([new Uint8Array(MAX_OUTPUT_BYTES+1)])}])).rejects.toThrow('zip-size');
  });
  it('normalizes export file names',()=>expect(outputFileName('holiday.photo.JPEG','png')).toBe('holiday.photo.png'));
});
