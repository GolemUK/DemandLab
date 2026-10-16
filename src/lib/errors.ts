export type ErrorCode = 'empty'|'size'|'rows'|'csv'|'headers'|'mapping'|'date'|'encoding'|'worker';
export class InputError extends Error { constructor(public code: ErrorCode) { super(code); } }
