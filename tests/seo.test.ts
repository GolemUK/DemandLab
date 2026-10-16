import {it,expect} from 'vitest';import {jsonLD} from '../src/lib/seo';
it('keeps structured data from closing its script element',()=>{const input={headline:'</script><img src=x onerror=alert(1)>'};const output=jsonLD(input);expect(output).not.toContain('<');expect(JSON.parse(output)).toEqual(input)});
