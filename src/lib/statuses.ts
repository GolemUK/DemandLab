import type { Status, Payment } from './types';
const statuses: Record<Status,string[]> = {
 new:['new','нове','новий','нове замовлення'], processing:['processing','in progress','в обробці','в роботі','обробляється'], shipped:['shipped','dispatched','відправлено','відправлене','відправлений'], delivered:['delivered','доставлено','доставлене','доставлений'], cancelled:['cancelled','canceled','скасовано','скасоване','скасований'], returned:['returned','повернено','повернене','повернений']
};
const payments: Record<Payment,string[]> = { paid:['paid','оплачено','сплачено'],unpaid:['unpaid','not paid','не оплачено','не сплачено','неоплачено'],refunded:['refunded','повернено','кошти повернено'],unknown:['unknown','невідомо'] };
function match<T extends string>(value:string, aliases:Record<T,string[]>): T|null { return (Object.keys(aliases) as T[]).find(key=>aliases[key].includes(value.trim().toLocaleLowerCase())) ?? null; }
export const normalizeStatus = (value:string) => match(value,statuses);
export const normalizePayment = (value:string) => match(value,payments);
