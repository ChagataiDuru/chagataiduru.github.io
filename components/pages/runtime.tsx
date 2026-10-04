'use client';
import {useEffect,useState} from 'react';
import {copy} from '@/lib/i18n';
import {absoluteUrl,articlePath,publishedArticleLinks,structuredData,jsonLd} from '@/lib/seo';
import type {Locale} from '@/lib/types';
import {publicClient,relatedTranslations,type PublicSnapshot} from '@/sanity/public';
import {watchPublished} from '@/sanity/watch-published';
import {AboutView,PortfolioView,BlogView,ArticleView} from './views';
export type Section='blog'|'about'|'portfolio'|'article';
export function PublicPage({locale,section,initial,mode,origin}:{locale:Locale;section:Section;initial:PublicSnapshot;mode:'fixture'|'sanity';origin:string}){
 const [data,setData]=useState(initial),[error,setError]=useState(false),[slug,setSlug]=useState<string|null>(null),[ready,setReady]=useState(section!=='article'),[retry,setRetry]=useState(0),[fresh,setFresh]=useState(mode==='fixture');
 useEffect(()=>{if(section==='article'){setSlug(new URLSearchParams(window.location.search).get('slug'));setReady(true);}},[section]);
 useEffect(()=>{
  if(mode==='fixture')return;
  const watcher=watchPublished(publicClient(),locale,result=>{setData(result);setFresh(true);setError(false);},()=>setError(true));
  const visible=()=>{if(document.visibilityState==='visible')void watcher.refresh();};document.addEventListener('visibilitychange',visible);
  return()=>{watcher.stop();document.removeEventListener('visibilitychange',visible);};
 },[locale,mode,retry]);
 const post=section==='article'&&slug?data.posts.find(p=>p.slug===slug)||null:null;
 const translations=post?relatedTranslations(data,post._id):[],articleLinks=post?{...publishedArticleLinks(translations),[locale]:articlePath(locale,post.slug)}:{};
 const articleReady=ready&&fresh;
 const missing=section==='article'&&articleReady&&!post;
 const path=post?articlePath(locale,post.slug):section==='article'?null:`/${locale}/${section==='blog'?'':`${section}/`}`;
 const t=copy[locale],name=data.settings?.name||'Çağatay Duru';
 const title=error?t.error:missing?t.notFound:post?post.title:section==='about'?t.about:section==='portfolio'?t.portfolio:t.blog;
 const description=post?.excerpt||(section==='about'?(locale==='tr'?'Çağatay Duru’nun biyografisi, yazılım deneyimi ve özgeçmişi.':'Biography, software engineering experience and CV of Çağatay Duru.'):section==='portfolio'?t.projectsIntro:locale==='tr'?'Çağatay Duru’nun yazılım ve teknoloji üzerine yazıları.':'Writing about software and technology by Çağatay Duru.');
 const languages:Record<string,string>=section==='article'?articleLinks:section==='about'?(data.profile?Object.fromEntries(relatedTranslations(data,data.profile._id).map(t=>[t.language,`/${t.language}/about/`])):{}):{en:`/en/${section==='blog'?'':'portfolio/'}`,tr:`/tr/${section==='blog'?'':'portfolio/'}`};
 if(path&&section!=='article')languages[locale]=path;
 const languageKey=JSON.stringify(languages);
 useEffect(()=>{
  if(!ready||(section==='article'&&!fresh&&!error))return;document.title=`${title} — ${name}`;
  function meta(attribute:'name'|'property',key:string,value:string){let el=document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);if(!el){el=document.createElement('meta');el.setAttribute(attribute,key);document.head.appendChild(el);}el.content=value;}
  meta('name','description',description);meta('name','robots',error||missing?'noindex, follow':'index, follow');meta('property','og:title',`${title} — ${name}`);meta('property','og:description',description);meta('property','og:locale',locale==='tr'?'tr_TR':'en_US');meta('property','og:type',post?'article':'website');meta('name','twitter:card','summary');meta('name','twitter:title',`${title} — ${name}`);meta('name','twitter:description',description);
  document.head.querySelectorAll('link[rel="canonical"],link[rel="alternate"][hreflang]').forEach(el=>el.remove());
  if(path&&!missing&&!error){const link=document.createElement('link');link.rel='canonical';link.href=absoluteUrl(path,origin);document.head.appendChild(link);meta('property','og:url',link.href);for(const [lang,href]of Object.entries(JSON.parse(languageKey))){const alt=document.createElement('link');alt.rel='alternate';alt.hreflang=lang;alt.href=absoluteUrl(href as string,origin);document.head.appendChild(alt);}}
  const published=document.head.querySelector('meta[property="article:published_time"]');published?.remove();if(post)meta('property','article:published_time',post.publishedAt);
 },[title,name,description,locale,path,origin,languageKey,missing,error,ready,post,section,fresh]);
 const schema=path&&!missing&&!error?structuredData({locale,path,origin,profile:section==='about'||post?data.profile:undefined,post,projects:section==='portfolio'?data.projects:undefined}):null;
 return <><title>{`${title} — ${name}`}</title><a className="skip-link" href="#main">{t.skip}</a><header className="site-header"><a className="site-name" href={`/${locale}/`}>{name}</a><nav aria-label={locale==='tr'?'Ana menü':'Main navigation'}>{[['',t.blog],['about/',t.about],['portfolio/',t.portfolio]].map(([suffix,label])=><a key={suffix} href={`/${locale}/${suffix}`} aria-current={(section==='blog'||section==='article')?!suffix?'page':undefined:section===suffix.replace('/','')?'page':undefined}>{label}</a>)}<span className="language-nav" aria-label={locale==='tr'?'Dil':'Language'}>{(['en','tr']as const).map(l=>l===locale?<span key={l} lang={l} aria-current="true">{l.toUpperCase()}</span>:section==='article'&&!articleLinks[l]?<span key={l} className="unavailable-language">{l.toUpperCase()}</span>:<a key={l} href={section==='article'?articleLinks[l]:`/${l}/${section==='blog'?'':`${section}/`}`} hrefLang={l} lang={l}>{l.toUpperCase()}</a>)}</span></nav></header>
 {schema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(schema)}}/>}
 {error?<main id="main" className="error-page"><h1>{t.error}</h1><p>{t.errorText}</p><button onClick={()=>setRetry(n=>n+1)}>{t.retry}</button></main>:section==='about'?<AboutView locale={locale} profile={data.profile}/>:section==='portfolio'?<PortfolioView locale={locale} projects={data.projects} fixture={mode==='fixture'}/>:section==='blog'?<BlogView locale={locale} posts={data.posts}/>:!articleReady?<main id="main"><p role="status">{locale==='tr'?'Yazı yükleniyor…':'Loading article…'}</p></main>:post?<ArticleView locale={locale} post={post} profile={data.profile} translations={translations}/>:<main id="main"><h1>{t.notFound}</h1><p className="page-intro">{t.notFoundText}</p><a href={`/${locale}/`}>{t.back}</a></main>}
 <footer className="site-footer"><span>© {name}</span>{mode==='fixture'&&<span className="fixture-label">{locale==='tr'?'Örnek içerik modu · Sanity bağlı değil':'Fixture content mode · Sanity is not connected'}</span>}</footer></>;
}
