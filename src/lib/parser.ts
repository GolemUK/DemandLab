import Papa from 'papaparse';
import type { ParsedCSV } from './types';
export const MAX_BYTES = 5 * 1024 * 1024;
export const MAX_ROWS = 10_000;
import { InputError } from './errors';
export { InputError, type ErrorCode } from './errors';
export function checkSize(size: number) { if (size > MAX_BYTES) throw new InputError('size'); }
export function parseCSV(text: string): ParsedCSV {
 checkSize(new TextEncoder().encode(text).byteLength);
 if (!text.replace(/^\uFEFF/,'').trim()) throw new InputError('empty');
 const result = Papa.parse<string[]>(text.replace(/^\uFEFF/,''), { delimiter: '', delimitersToGuess: [',',';'], skipEmptyLines: 'greedy', preview: MAX_ROWS + 2 });
 if (result.data.length - 1 > MAX_ROWS || result.meta.truncated) throw new InputError('rows');
 if (result.errors.length) throw new InputError('csv');
 const [headers, ...rows] = result.data;
 if (!headers?.length || headers.some(h => !h.trim()) || new Set(headers.map(h=>h.trim().toLocaleLowerCase())).size !== headers.length) throw new InputError('headers');
 if (!rows.length) throw new InputError('empty');
 if (rows.some(r => r.length !== headers.length)) throw new InputError('csv');
 return { headers, rows };
}
