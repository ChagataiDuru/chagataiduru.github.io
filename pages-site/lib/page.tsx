import type {Metadata} from 'next';
import {PublicPage,type Section} from '@/components/pages/runtime';
import {copy} from '@/lib/i18n';
import {relatedTranslations} from '@/sanity/public';
import type {Locale} from '@/lib/types';
import {snapshot,mode} from './snapshot';
export const origin=process.env.NEXT_PUBLIC_SITE_URL||'https://chagataiduru.github.io';
export async function metadata(locale:Locale,section:Section):Promise<Metadata>{
 const data=await snapshot(locale),t=copy[locale],name=data.settings?.name||'Çağatay Duru';
 const title=section==='about'?t.about:section==='portfolio'?t.portfolio:t.blog;
 const description=section==='about'?(locale==='tr'?'Çağatay Duru’nun biyografisi, yazılım deneyimi ve özgeçmişi.':'Biography, software engineering experience and CV of Çağatay Duru.'):section==='portfolio'?t.projectsIntro:locale==='tr'?'Çağatay Duru’nun yazılım ve teknoloji üzerine yazıları.':'Writing about software and technology by Çağatay Duru.';
 const path=`/${locale}/${section==='blog'?'':section==='article'?'blog/':`${section}/`}`;
 const languages:Record<string,string>=section==='about'?Object.fromEntries(relatedTranslations(data,data.profile?._id||'').map(t=>[t.language,`/${t.language}/about/`])):{en:`/en/${section==='blog'?'':'portfolio/'}`,tr:`/tr/${section==='blog'?'':'portfolio/'}`};languages[locale]=path;
 return {description,...(section==='article'?{}:{alternates:{canonical:path,languages}}),openGraph:{title:`${title} — ${name}`,description,siteName:name,type:'website',locale:locale==='tr'?'tr_TR':'en_US',...(section==='article'?{}:{url:path})},twitter:{card:'summary',title:`${title} — ${name}`,description},robots:{index:true,follow:true}};
}
export async function Page({locale,section}:{locale:Locale;section:Section}){return <PublicPage locale={locale} section={section} initial={await snapshot(locale)} mode={mode()} origin={origin}/>;}
