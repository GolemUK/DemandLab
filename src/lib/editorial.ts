export const categoryIds = ['technology','mobile','windows','ai','business'] as const;
export type CategoryId = typeof categoryIds[number];
export function normalizeSearch(value:string):string { return value.normalize('NFKC').toLocaleLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim(); }
export function matchesSearch(text:string,query:string):boolean { const haystack=normalizeSearch(text);return normalizeSearch(query).split(' ').filter(Boolean).every(word=>haystack.includes(word)); }
