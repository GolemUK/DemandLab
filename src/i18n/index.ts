import en from './en';
import uk from './uk';
export {locales,type Locale} from './locales';
import type {Locale} from './locales';
export const dictionaries={en,uk};
export const t=(locale:Locale)=>dictionaries[locale];
export const href=(locale:Locale,slug='')=>'/'+locale+'/'+(slug?slug.replace(/^\/|\/$/g,'')+'/':'');
