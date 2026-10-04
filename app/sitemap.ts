export const dynamic='force-dynamic';
import type {MetadataRoute} from 'next';
import {getPosts,getTranslations} from '@/lib/content';
import {translationPaths} from '@/lib/content-policy';
import {siteUrl} from '@/lib/metadata';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const pages:MetadataRoute.Sitemap=[];
 for(const locale of ['en','tr'] as const){for(const suffix of ['','/about','/portfolio'])pages.push({url:`${siteUrl}/${locale}${suffix}`});for(const p of await getPosts(locale,true))pages.push({url:`${siteUrl}/${locale}/blog/${p.slug}`,lastModified:p.publishedAt,alternates:{languages:Object.fromEntries(Object.entries(translationPaths(await getTranslations(p._id),'blog')).map(([l,path])=>[l,`${siteUrl}${path}`]))}});}
 return pages;
}
