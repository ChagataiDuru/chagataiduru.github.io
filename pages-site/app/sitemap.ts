import type {MetadataRoute} from 'next';
import {snapshot} from '../lib/snapshot';
import {origin} from '../lib/page';
import {articlePath,absoluteUrl,publishedArticleLinks} from '@/lib/seo';
import {relatedTranslations} from '@/sanity/public';
export const dynamic='force-static';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const pages:MetadataRoute.Sitemap=[];
 for(const locale of ['en','tr']as const){const data=await snapshot(locale);for(const section of ['','about/','portfolio/']){const languages=section==='about/'?Object.fromEntries(relatedTranslations(data,data.profile?._id||'').map(t=>[t.language,absoluteUrl(`/${t.language}/about/`,origin)])):{en:absoluteUrl(`/en/${section}`,origin),tr:absoluteUrl(`/tr/${section}`,origin)};languages[locale]=absoluteUrl(`/${locale}/${section}`,origin);pages.push({url:absoluteUrl(`/${locale}/${section}`,origin),alternates:{languages}});}
 for(const p of data.posts){const translations={...publishedArticleLinks(relatedTranslations(data,p._id)),[locale]:articlePath(locale,p.slug)};pages.push({url:absoluteUrl(articlePath(locale,p.slug),origin),lastModified:p.publishedAt,alternates:{languages:Object.fromEntries(Object.entries(translations).map(([l,path])=>[l,absoluteUrl(path,origin)]))}});}}
 return pages;
}
