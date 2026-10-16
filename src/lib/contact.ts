export function contactURL(value:string|undefined,service:'telegram'|'viber'):string|undefined {
 if(!value)return;try{const u=new URL(value);if(u.username||u.password)return;
 if(service==='telegram'&&u.protocol==='https:'&&['t.me','telegram.me'].includes(u.hostname)&&u.pathname.length>1)return u.href;
 if(service==='viber'&&((u.protocol==='viber:'&&['chat','add'].includes(u.hostname))||(u.protocol==='https:'&&['invite.viber.com','vb.me'].includes(u.hostname)&&u.pathname.length>1)))return u.href;
 }catch{return;}
}
