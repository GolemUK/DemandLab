import type { ParsedCSV, Mapping, Issue, Category, Severity, Report } from './types';
import { validateMapping } from './mapping';
import { isDate } from './dates';
import { InputError } from './errors';
import { normalizeStatus, normalizePayment } from './statuses';
export function analyze(data: ParsedCSV, mapping: Mapping, reference: string, warnMissingShip = true): Report {
 validateMapping(mapping,data.headers.length);
 if (!isDate(reference)) throw new InputError('date');
 const issues: Issue[] = [];
 const seen = new Set<string>(); const ids = new Map<string,number>();
 const read = (row:string[], field:keyof Mapping) => mapping[field]===null ? '' : row[mapping[field]!].trim();
 data.rows.forEach(row=>{const id=read(row,'order_id');if(id) ids.set(id,(ids.get(id)??0)+1);});
 data.rows.forEach((row,index)=>{
  const orderId=read(row,'order_id'); const rawStatus=read(row,'status'); const status=normalizeStatus(rawStatus);
  const add=(category:Category,severity:Severity,priority:number)=>issues.push({row:index+2,orderId,category,severity,priority});
  if(!orderId) add('missing_id','high',2);
  if(!rawStatus) add('missing_status','high',2); else if(!status) add('unknown_status','medium',2);
  if(!isDate(read(row,'created_at'))) add('invalid_created','medium',2);
  const ship=read(row,'ship_by');
  if(ship && !isDate(ship)) add('invalid_ship','medium',2);
  if(ship && isDate(ship) && ship<reference && (status==='new'||status==='processing')) add('overdue','high',1);
  if(!ship && warnMissingShip && (status==='new'||status==='processing')) add('missing_ship','info',4);
  // Compare every parsed field exactly. Equal IDs with different line items are not exact duplicates.
  const key=JSON.stringify(row);
  if(seen.has(key)) add('duplicate','medium',3); else seen.add(key);
  if(orderId && ids.get(orderId)!>1) add('repeated_id','info',4);
  const rawPayment=read(row,'payment_status'); const payment=normalizePayment(rawPayment);
  if(rawPayment && !payment) add('unknown_payment','info',4);
  if(status==='shipped' && payment==='unpaid') add('payment','info',4);
 });
 issues.sort((a,b)=>a.priority-b.priority||a.row-b.row||a.category.localeCompare(b.category));
 const invalidCategories: Category[]=['missing_id','missing_status','unknown_status','invalid_created','invalid_ship'];
 const count=(category:Category)=>issues.filter(i=>i.category===category).length;
 return { issues,total:data.rows.length,review:new Set(issues.map(i=>i.orderId ? 'id:'+i.orderId : 'row:'+i.row)).size,overdue:count('overdue'),duplicates:count('duplicate'),invalid:new Set(issues.filter(i=>invalidCategories.includes(i.category)).map(i=>i.row)).size,information:issues.filter(i=>i.severity==='info').length };
}
