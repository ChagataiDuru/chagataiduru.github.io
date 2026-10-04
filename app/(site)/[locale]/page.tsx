import {stegaClean} from '@sanity/client/stega';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getPosts} from '@/lib/content';
import {copy,isLocale} from '@/lib/i18n';
import {readingTime} from '@/lib/content-policy';
import {pageMetadata} from '@/lib/metadata';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))return {};return pageMetadata(locale,'','Blog',locale==='en'?'Writing by Çağatay Duru.':'Çağatay Duru’nun yazıları.',{en:'/en',tr:'/tr'});}
export default async function Blog({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();const posts=await getPosts(locale),t=copy[locale];
 return <main id="main" className="index-page"><h1>{t.blog}</h1>{posts.length?<div className="post-list">{posts.map(post=><article key={post._id}><div className="meta"><time dateTime={stegaClean(post.publishedAt)}>{new Intl.DateTimeFormat(locale,{dateStyle:'long'}).format(new Date(stegaClean(post.publishedAt)))}</time><span>{readingTime(post.body)} {t.reading}</span></div><h2><Link href={`/${locale}/blog/${encodeURIComponent(stegaClean(post.slug))}`}>{post.title}</Link></h2><p>{post.excerpt}</p></article>)}</div>:<div className="empty-blog"><h2>{t.emptyTitle}</h2><p>{t.empty}</p><div className="empty-links"><Link href={`/${locale}/about`}>{t.aboutLink}</Link><Link href={`/${locale}/portfolio`}>{t.projectsLink}</Link></div></div>}</main>;
}
