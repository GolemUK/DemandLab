import {describe,it,expect} from 'vitest';
import {transformArticleHtml} from '../scripts/article-design.mjs';

describe('article design markdown patterns',()=>{
  it('styles localized warnings without changing their text',()=>{
    const html=transformArticleHtml('<blockquote><p><strong>Увага до синхронізації:</strong> Details.</p></blockquote>');
    expect(html).toContain('class="warning-callout"');
    expect(html).toContain('<strong>Увага до синхронізації:</strong> Details.');
  });
  it('marks a useful note as an info callout',()=>{
    expect(transformArticleHtml('<blockquote><p><strong>Note:</strong> Details.</p></blockquote>')).toContain('class="info-callout"');
  });
  it('recognizes the English OneDrive warning from its complete label',()=>{
    expect(transformArticleHtml('<blockquote><p><strong>OneDrive caution:</strong> Check sync first.</p></blockquote>')).toContain('class="warning-callout"');
  });
  it('styles ordered procedures and comparison tables only',()=>{
    const html=transformArticleHtml('<ol><li>Do it</li></ol><table><tr><td>Cell</td></tr></table>');
    expect(html).toContain('<ol class="step-by-step">');
    expect(html).toContain('<table class="comparison-table">');
  });
  it('reserves space for supplied article diagrams and loads them lazily',()=>{
    const html=transformArticleHtml('<p><img src="/assets/wifi.svg" alt="Wi-Fi diagram"></p>');
    expect(html).toContain('width="1200" height="600"');
    expect(html).toContain('loading="lazy" decoding="async"');
  });
  it('leaves ordinary quotations neutral',()=>{
    const html=transformArticleHtml('<blockquote><p>A quote without a callout label.</p></blockquote>');
    expect(html).toBe('<blockquote><p>A quote without a callout label.</p></blockquote>');
  });
});
