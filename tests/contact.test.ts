import {it,expect} from 'vitest';import {contactURL} from '../src/lib/contact';
it('does not create contact buttons for absent or unsafe configuration',()=>{for(const url of [undefined,'','javascript:alert(1)','https://evil.test/user','https://user:password@t.me/name','https://t.me/'])expect(contactURL(url,'telegram')).toBeUndefined()});
it('accepts valid service links',()=>{expect(contactURL('https://t.me/demandlab_test','telegram')).toBe('https://t.me/demandlab_test');expect(contactURL('viber://chat?number=%2B123456789','viber')).toBeDefined();expect(contactURL('https://vb.me/example','viber')).toBeDefined()});
it('rejects unsupported Viber actions',()=>expect(contactURL('viber://unknown-action','viber')).toBeUndefined());
