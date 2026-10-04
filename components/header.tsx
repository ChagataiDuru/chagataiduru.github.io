'use client';
import {useArticleLanguages} from './language-context';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {copy} from '@/lib/i18n';
import type {Locale} from '@/lib/types';
export function Header({locale,name}:{locale:Locale;name:string}) {
 const path=usePathname(),t=copy[locale];
 const articleLanguages=useArticleLanguages();
 const isArticle=path.includes('/blog/');
 return <header className="site-header"><Link href={`/${locale}`} className="site-name">{name}</Link><nav aria-label={locale==='tr'?'Ana menü':'Main navigation'}>
 {[['',t.blog],['/about',t.about],['/portfolio',t.portfolio]].map(([suffix,label])=><Link key={suffix} href={`/${locale}${suffix}`} aria-current={path===`/${locale}${suffix}` || (!suffix&&isArticle)?'page':undefined}>{label}</Link>)}
 <span className="language-nav" aria-label={locale==='tr'?'Dil':'Language'}>{(['en','tr'] as const).map(l=>l===locale?<span key={l} aria-current="true" lang={l}>{l.toUpperCase()}</span>:!isArticle?<a key={l} href={path.replace(/^\/(en|tr)/,`/${l}`)} hrefLang={l} lang={l}>{l.toUpperCase()}</a>:articleLanguages[l]?<a key={l} href={articleLanguages[l]} hrefLang={l} lang={l}>{l.toUpperCase()}</a>:<span key={l} className="unavailable-language" aria-label={locale==='tr'?'İngilizce çeviri yayımlanmadı':'Turkish translation is not published'}>{l.toUpperCase()}</span>)}</span>
 </nav></header>;
}
