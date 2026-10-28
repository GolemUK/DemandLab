const warningLabel=/^(warning|important|caution|one ?drive caution|before deleting|sync warning|photo deletion|увага|важливо|перед видаленням|видалення фотографій)/i;
const infoLabel=/^(note|tip|helpful|the diagram|the schema|reading the diagram|як читати схему|схема|примітка|порада|корисно)/i;
const suppliedSvgDimensions={ 'ai-search':[1200,600], 'local-ai':[1200,600], passkeys:[1200,600], wifi:[1200,600] };

/** Apply editorial classes to rendered static HTML after Astro's content renderer. */
export function transformArticleHtml(html) {
  return html
    .replace(/<blockquote(\s[^>]*)?>([\s\S]*?)<\/blockquote>/gi,(match,attributes='',body)=>{
      const marker=body.match(/<strong[^>]*>([\s\S]*?)<\/strong>/i)?.[1]??body;
      const label=marker.replace(/<[^>]*>/g,' ').replace(/&(?:nbsp|#160);/g,' ').trim().toLocaleLowerCase();
      const name=warningLabel.test(label)?'warning-callout':infoLabel.test(label)?'info-callout':undefined;
      if(!name)return match;
      const classes=attributes.match(/\bclass=["']([^"']*)["']/i)?.[1].split(/\s+/)??[];
      if(classes.includes(name))return match;
      const updated=[...classes,name].join(' ');
      return attributes?`<blockquote${attributes.replace(/\bclass=["'][^"']*["']/i,`class="${updated}"`)}>${body}</blockquote>`:`<blockquote class="${updated}">${body}</blockquote>`;
    })
    .replace(/<ol(\s[^>]*)?>/gi,(tag)=>tag.replace(/>$/,`${/\bclass=/i.test(tag)?'':' class="step-by-step"'}>`))
    .replace(/<table(\s[^>]*)?>/gi,(tag)=>tag.replace(/>$/,`${/\bclass=/i.test(tag)?'':' class="comparison-table"'}>`))
    .replace(/<img\b([^>]*\bsrc=["']\/assets\/(ai-search|local-ai|passkeys|wifi)\.svg["'][^>]*)>/gi,(tag,attributes,name)=>{
      const [width,height]=suppliedSvgDimensions[name];
      let updated=attributes;
      if(!/\bwidth=/i.test(updated))updated+=` width="${width}"`;
      if(!/\bheight=/i.test(updated))updated+=` height="${height}"`;
      if(!/\bloading=/i.test(updated))updated+=' loading="lazy"';
      if(!/\bdecoding=/i.test(updated))updated+=' decoding="async"';
      return `${tag.slice(0,4)}${updated}>`;
    });
}
