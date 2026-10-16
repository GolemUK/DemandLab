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
 category:z.enum(categoryIds),tags:z.array(z.string()).min(1),publishedAt:date,updatedAt:date,
 sourcesCheckedAt:date,sources:z.array(z.object({title:z.string(),url:z.url({protocol:/^https?$/})})).min(1),
 image:z.object({src:z.string().startsWith('/'),alt:z.string().min(1),caption:z.string().optional()}).optional(),
 relatedArticles:z.array(z.string()).default([]),relatedTools:z.array(z.enum(['order-rescue'])).default([]),
 seo:z.object({title:z.string().optional(),description:z.string().optional()}).default({})
 }).refine(data=>data.updatedAt>=data.publishedAt,{message:'Updated date cannot precede publication',path:['updatedAt']})
}) };
