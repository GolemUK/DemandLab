import type { Issue } from './types';
export function safeCell(value:string):string {
 return /^[\s\u0000-\u001f\u007f]*[=+@-]/.test(value) || /^[\t\r\n\u0000-\u001f\u007f]/.test(value) ? "'"+value : value;
}
function quote(value:string):string { return '"'+safeCell(value).replaceAll('"','""')+'"'; }
export function exportReport(issues:Issue[], headings:string[], describe:(issue:Issue)=>string[]):string {
 const records = [headings,...issues.map(issue=>[issue.orderId,...describe(issue)])];
 return '\uFEFF'+records.map(record=>record.map(quote).join(',')).join('\r\n');
}
