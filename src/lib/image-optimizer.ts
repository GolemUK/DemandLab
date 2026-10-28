export type ImageFormat = 'jpeg' | 'png' | 'webp';
export const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_IMAGE_COUNT = 10;
export const MAX_BATCH_BYTES = 80 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 40_000_000;
export const MAX_OUTPUT_BYTES = 100 * 1024 * 1024;

export interface ImageDimensions { width: number; height: number }
export interface ResizeOptions extends ImageDimensions { preserveAspectRatio: boolean }
export interface ImageBitmapLike extends ImageDimensions { close(): void }
export interface CanvasLike {
  width: number;
  height: number;
  getContext(type: '2d'): CanvasRenderingContext2D | null;
  toBlob(callback: BlobCallback, type: string, quality?: number): void;
}
export interface ImageRuntime {
  decode(file: Blob): Promise<ImageBitmapLike>;
  createCanvas(width: number, height: number): CanvasLike;
}
export interface OptimizeOptions extends ResizeOptions {
  format: ImageFormat;
  quality: number;
  background: string;
}
export interface OptimizedImage { blob: Blob; width: number; height: number; name: string; savedPercent: number }
export interface BatchItem { file: File; options: OptimizeOptions }
export interface BatchResult { output?: OptimizedImage; error?: string }

export function validateImageFile(file: Pick<File, 'type'|'size'>): string | null {
  if (!supportedImageTypes.includes(file.type as typeof supportedImageTypes[number])) return 'type';
  if (!Number.isFinite(file.size) || file.size <= 0) return 'empty';
  if (file.size > MAX_IMAGE_BYTES) return 'size';
  return null;
}

export function validateImageBatch(files: ArrayLike<Pick<File, 'type'|'size'>>): string | null {
  if (files.length < 1) return 'empty-list';
  if (files.length > MAX_IMAGE_COUNT) return 'count';
  let bytes = 0;
  for (const file of Array.from(files)) {
    const error = validateImageFile(file);
    if (error) return error;
    bytes += file.size;
    if (bytes > MAX_BATCH_BYTES) return 'batch-size';
  }
  return null;
}

export function resizeDimensions(original: ImageDimensions, options: ResizeOptions): ImageDimensions {
  if (![original.width, original.height, options.width, options.height].every(Number.isFinite)
    || original.width < 1 || original.height < 1 || options.width < 0 || options.height < 0) throw new RangeError('dimensions');
  let width = Math.round(options.width || original.width);
  let height = Math.round(options.height || original.height);
  if (options.preserveAspectRatio) {
    const scale = Math.min(width / original.width, height / original.height);
    width = Math.max(1, Math.round(original.width * scale));
    height = Math.max(1, Math.round(original.height * scale));
  }
  if (width * height > MAX_IMAGE_PIXELS) throw new RangeError('pixels');
  return { width, height };
}

export function outputFileName(name: string, format: ImageFormat): string {
  const stem = name.replace(/\.[^.]+$/, '') || 'image';
  return `${stem}.${format}`;
}

export async function optimizeImage(file: File, options: OptimizeOptions, runtime: ImageRuntime): Promise<OptimizedImage> {
  const invalid = validateImageFile(file);
  if (invalid) throw new RangeError(invalid);
  if (!Number.isFinite(options.quality) || options.quality < 0.1 || options.quality > 1) throw new RangeError('quality');
  if (!/^#[\da-f]{6}$/i.test(options.background)) throw new RangeError('background');
  let bitmap: ImageBitmapLike | undefined;
  let canvas: CanvasLike | undefined;
  try {
    bitmap = await runtime.decode(file);
    if (bitmap.width * bitmap.height > MAX_IMAGE_PIXELS) throw new RangeError('pixels');
    const { width, height } = resizeDimensions(bitmap, options);
    canvas = runtime.createCanvas(width, height);
    const context = canvas.getContext('2d');
    if (!context) throw new RangeError('canvas');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    if (options.format === 'jpeg') {
      context.fillStyle = options.background;
      context.fillRect(0, 0, width, height);
    }
    context.drawImage(bitmap as CanvasImageSource, 0, 0, width, height);
    const mime = options.format === 'jpeg' ? 'image/jpeg' : `image/${options.format}`;
    const blob = await new Promise<Blob>((resolve, reject) => canvas!.toBlob(value => {
      if (!value) reject(new RangeError('encode'));
      else if (value.type !== mime) reject(new RangeError('format-unsupported'));
      else resolve(value);
    }, mime, options.format === 'png' ? undefined : options.quality));
    const savedPercent = file.size > 0 ? (file.size - blob.size) / file.size * 100 : 0;
    return { blob, width, height, name: outputFileName(file.name, options.format), savedPercent };
  } finally {
    bitmap?.close();
    if (canvas) { canvas.width = 0; canvas.height = 0; }
  }
}

export async function optimizeImageBatch(entries: BatchItem[], runtime: ImageRuntime, onProgress?: (index: number, total: number) => void | Promise<void>): Promise<BatchResult[]> {
  const results: BatchResult[] = [];
  let outputBytes = 0;
  for (let index = 0; index < entries.length; index++) {
    await onProgress?.(index + 1, entries.length);
    try {
      const output = await optimizeImage(entries[index].file, entries[index].options, runtime);
      if (outputBytes + output.blob.size > MAX_OUTPUT_BYTES) {
        results.push({ error: 'output-limit' });
        for (let rest = index + 1; rest < entries.length; rest++) results.push({ error: 'output-limit' });
        break;
      }
      outputBytes += output.blob.size;
      results.push({ output });
    } catch (cause) {
      results.push({ error: cause instanceof RangeError ? cause.message : 'decode' });
    }
  }
  return results;
}

export class ObjectUrlPool {
  private readonly urls = new Set<string>();
  constructor(private readonly create: (value: Blob) => string, private readonly revoke: (url: string) => void) {}
  createURL(value: Blob): string { const url = this.create(value); this.urls.add(url); return url; }
  release(url: string | undefined): void { if (url && this.urls.delete(url)) this.revoke(url); }
  clear(): void { for (const url of this.urls) this.revoke(url); this.urls.clear(); }
  get size(): number { return this.urls.size; }
}

export interface DownloadRuntime {
  createObjectURL(blob: Blob): string;
  revokeObjectURL(url: string): void;
  trigger(url: string, name: string): void;
  defer(callback: () => void, delayMs: number): void;
}

export function downloadBlob(blob: Blob, name: string, runtime: DownloadRuntime): void {
  const url = runtime.createObjectURL(blob);
  try { runtime.trigger(url, name); }
  finally { runtime.defer(() => runtime.revokeObjectURL(url), 1500); }
}

export interface ZipEntry { name: string; blob: Blob }

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function write16(view: DataView, offset: number, value: number): void { view.setUint16(offset, value, true); }
function write32(view: DataView, offset: number, value: number): void { view.setUint32(offset, value, true); }

export async function createStoredZip(entries: ZipEntry[]): Promise<Blob> {
  if (!entries.length) throw new RangeError('empty-zip');
  if (entries.length > MAX_IMAGE_COUNT) throw new RangeError('count');
  if (entries.reduce((sum, entry) => sum + entry.blob.size, 0) > MAX_OUTPUT_BYTES) throw new RangeError('zip-size');
  const prepared = await Promise.all(entries.map(async entry => {
    const safeName = entry.name.replace(/[^\w.\-() ]/g, '_').replace(/\.\./g, '_').slice(0, 120) || 'image.bin';
    return { name: new TextEncoder().encode(safeName), bytes: new Uint8Array(await entry.blob.arrayBuffer()) };
  }));
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;
  for (const item of prepared) {
    const checksum = crc32(item.bytes);
    const local = new Uint8Array(30 + item.name.length);
    const lv = new DataView(local.buffer);
    write32(lv, 0, 0x04034b50); write16(lv, 4, 20); write16(lv, 6, 0x0800); write16(lv, 8, 0);
    write32(lv, 14, checksum); write32(lv, 18, item.bytes.length); write32(lv, 22, item.bytes.length); write16(lv, 26, item.name.length);
    local.set(item.name, 30); localParts.push(local, item.bytes);
    const central = new Uint8Array(46 + item.name.length);
    const cv = new DataView(central.buffer);
    write32(cv, 0, 0x02014b50); write16(cv, 4, 20); write16(cv, 6, 20); write16(cv, 8, 0x0800); write16(cv, 10, 0);
    write32(cv, 16, checksum); write32(cv, 20, item.bytes.length); write32(cv, 24, item.bytes.length); write16(cv, 28, item.name.length); write32(cv, 42, offset);
    central.set(item.name, 46); centralParts.push(central); offset += local.length + item.bytes.length;
  }
  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22); const ev = new DataView(end.buffer);
  write32(ev, 0, 0x06054b50); write16(ev, 8, prepared.length); write16(ev, 10, prepared.length);
  write32(ev, 12, centralSize); write32(ev, 16, offset);
  const parts = [...localParts, ...centralParts, end];
  const byteLength = parts.reduce((sum, part) => sum + part.byteLength, 0);
  const archive = new Uint8Array(byteLength);
  let cursor = 0;
  for (const part of parts) { archive.set(part, cursor); cursor += part.byteLength; }
  return new Blob([archive.buffer], { type: 'application/zip' });
}
