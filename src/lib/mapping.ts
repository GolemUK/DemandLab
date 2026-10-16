import { fields, type Field, type Mapping } from './types';
import { InputError } from './errors';
const aliases: Record<Field,string[]> = {
 order_id: ['order_id','order id','order number','id','номер замовлення','ідентифікатор замовлення','замовлення'],
 created_at: ['created_at','created at','created','order date','date','дата','дата замовлення','дата створення'],
 status: ['status','order status','fulfillment status','статус','статус замовлення'],
 ship_by: ['ship_by','ship by','dispatch deadline','дата відправлення','відправити до','термін відправлення'],
 payment_status: ['payment_status','payment status','payment','статус оплати','оплата'],
 total: ['total','amount','сума','вартість']
};
export function suggestMapping(headers: string[]): Mapping {
 return Object.fromEntries(fields.map(field => { const matches = headers.map((h,i)=>aliases[field].includes(h.trim().toLocaleLowerCase()) ? i : -1).filter(i=>i>=0); return [field, matches.length===1 ? matches[0] : null]; })) as Mapping;
}
export function validateMapping(mapping: Mapping, columnCount: number) {
 const used = fields.map(f=>mapping[f]).filter((x): x is number=>x!==null);
 if (['order_id','created_at','status'].some(f=>mapping[f as Field]===null) || used.some(i=>!Number.isInteger(i)||i<0||i>=columnCount) || new Set(used).size!==used.length) throw new InputError('mapping');
}
