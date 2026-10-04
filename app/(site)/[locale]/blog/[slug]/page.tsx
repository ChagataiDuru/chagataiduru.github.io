import {StructuredData} from '@/components/structured-data';
import {structuredData} from '@/lib/seo';
import {siteUrl} from '@/lib/metadata';
import {stegaClean} from '@sanity/client/stega';
import {PublishedArticleLanguages} from '@/components/language-context';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getPost,getProfile,getTranslations} from '@/lib/content';
import {isLocale,copy} from '@/lib/i18n';
import {translationPaths,readingTime,safeUrl} from '@/lib/content-policy';
import {pageMetadata} from '@/lib/metadata';
import {RichText,imageUrl} from '@/components/rich-text';
import {Contacts} from '@/components/contacts';
type Props={params:Promise<{locale:string;slug:string}>};
export async function generateMetadata({params}:Props){const {locale,slug}=await params;if(!isLocale(locale))return{};const p=await getPost(locale,slug,true);if(!p)return{title:copy[locale].notFound,robots:{index:false,follow:false}};return {...pageMetadata(locale,`/blog/${p.slug}`,p.title,p.excerpt,{...translationPaths(await getTranslations(p._id),'blog'),[locale]:`/${locale}/blog/${p.slug}`}),openGraph:{type:'article',title:p.title,description:p.excerpt,publishedTime:p.publishedAt,url:`/${locale}/blog/${p.slug}`,locale:locale==='tr'?'tr_TR':'en_US'}};}
export default async function Article({params}:Props){
 const {locale,slug}=await params;if(!isLocale(locale))notFound();const post=await getPost(locale,slug);if(!post)notFound();
 const [profile,translations]=await Promise.all([getProfile(locale),getTranslations(post._id)]),t=copy[locale];
 const paths=translationPaths(translations,'blog'),cover=imageUrl(post.cover),portrait=profile&&(imageUrl(profile.portrait,220)||safeUrl(profile.portraitUrl));
 return <><StructuredData value={structuredData({locale,path:`/${locale}/blog/${encodeURIComponent(post.slug)}`,origin:siteUrl,profile,post})}/><main id="main" className="article-layout"><PublishedArticleLanguages links={paths}/><aside className="author-sidebar">{portrait&&<img src={portrait} alt={profile?.name||'Çağatay Duru'} width={100} height={100}/>}<div><h2>{profile?.name||'Çağatay Duru'}</h2><p>{profile?.role||'Software Engineer'}</p><Link href={`/${locale}/about`}>{t.aboutLink}</Link><Contacts contacts={profile?.contacts}/></div></aside><article className="article"><h1>{post.title}</h1><div className="meta"><time dateTime={stegaClean(post.publishedAt)}>{new Intl.DateTimeFormat(locale,{dateStyle:'long'}).format(new Date(stegaClean(post.publishedAt)))}</time><span>{readingTime(post.body)} {t.reading}</span></div>{Object.keys(paths).some(l=>l!==locale)&&<nav className="article-translations" aria-label={locale==='tr'?'Yazının diğer dilleri':'Article translations'}>{Object.entries(paths).filter(([l])=>l!==locale).map(([l,href])=><a key={l} href={href} hrefLang={l}>{l==='tr'?'Türkçe oku':'Read in English'}</a>)}</nav>}<p className="excerpt">{post.excerpt}</p>{cover&&<img className="article-cover" src={cover} alt={post.cover?.alt||''}/>}<RichText body={post.body}/>{!!post.tags?.length&&<p className="tags">{post.tags.join(' · ')}</p>}<p style={{marginTop:40}}><Link href={`/${locale}`}>{t.back}</Link></p></article></main></>;
}
