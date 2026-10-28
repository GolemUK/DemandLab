import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { locales } from './i18n';
import { categoryIds } from './lib/editorial';
import { isDate } from './lib/dates';
const date=z.string().refine(isDate,'Use a valid YYYY-MM-DD date');
export const collections = { guides: defineCollection({
 loader: glob({ pattern:'**/*.md',base:'./src/content/guides' }),
 schema:z.object({
 title:z.string().min(10),description:z.string().min(20),locale:z.enum(locales),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),translationKey:z.string(),published:z.boolean().default(false),
 category:z.enum(categoryIds),tags:z.array(z.string()).min(1),publishedAt:date.optional(),updatedAt:date.optional(),
 status:z.enum(['draft','editorial-review']).optional(),
 sourcesCheckedAt:date.optional(),sources:z.array(z.object({title:z.string(),url:z.url({protocol:/^https?$/})})).default([]),
 image:z.object({src:z.string().regex(/^\/.*\.(?:svg|webp)$/i,'Article images must be local SVG or WebP assets'),alt:z.string().min(1),width:z.number().int().positive(),height:z.number().int().positive(),caption:z.string().optional()}).optional(),
 checklist:z.array(z.string().min(5)).optional(),
 relatedArticles:z.array(z.string()).default([]),relatedTools:z.array(z.enum(['order-rescue','profit-calculator','image-optimizer'])).default([]),
 seo:z.object({title:z.string().optional(),description:z.string().optional()}).default({})
 }).refine(data=>!data.published||(!!data.publishedAt&&!!data.updatedAt&&!!data.sourcesCheckedAt&&data.sources.length>0&&data.updatedAt>=data.publishedAt&&data.status!=='editorial-review'),{message:'Published guides require verified sources, publication/update/source-check dates, and cannot remain in editorial review',path:['published']})
}) };
