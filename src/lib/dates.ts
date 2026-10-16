export function isDate(value: string): boolean {
 if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
 const [year,month,day] = value.split('-').map(Number);
 const leap = year%4===0 && (year%100!==0 || year%400===0);
 const days = [31,leap?29:28,31,30,31,30,31,31,30,31,30,31];
 return year>=1 && month>=1 && month<=12 && day>=1 && day<=days[month-1];
}
export function localToday(date = new Date()): string { return [String(date.getFullYear()).padStart(4,'0'),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-'); }
