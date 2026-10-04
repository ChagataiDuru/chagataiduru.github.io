import {safeUrl} from './content-policy';
import type {Locale,Post,Profile,Project,Translation} from './types';
export const absoluteUrl=(path:string,origin:string)=>new URL(path,origin).href;
export const articlePath=(locale:Locale,slug:string)=>`/${locale}/blog/?slug=${encodeURIComponent(slug)}`;
export function publishedArticleLinks(translations:Translation[]) {
 return Object.fromEntries(translations.filter(t=>(t.language==='en'||t.language==='tr')&&t.slug).map(t=>[t.language,articlePath(t.language,t.slug!)]));
}
export function jsonLd(value:unknown){return JSON.stringify(value).replace(/</g,'\\u003c');}
export function structuredData({locale,path,origin,profile,post,projects}:{locale:Locale;path:string;origin:string;profile?:Profile|null;post?:Post|null;projects?:Project[]}) {
 const url=absoluteUrl(path,origin),author={'@type':'Person','@id':absoluteUrl('/#person',origin),name:profile?.name||'Çağatay Duru',url:absoluteUrl(`/${locale}/about/`,origin),jobTitle:profile?.role||'Software Engineer',...(profile?{sameAs:profile.contacts.map(c=>safeUrl(c.url)).filter(u=>u?.startsWith('https://')),image:profile.portraitUrl?absoluteUrl(profile.portraitUrl,origin):undefined}:{})};
 const page=post?{'@type':'BlogPosting',headline:post.title,description:post.excerpt,datePublished:post.publishedAt,inLanguage:locale,author,mainEntityOfPage:url,url,keywords:post.tags?.join(', ')}:projects?{'@type':'CollectionPage',name:locale==='tr'?'Çağatay Duru — Portfolyo':'Çağatay Duru — Portfolio',inLanguage:locale,url,mainEntity:{'@type':'ItemList',itemListElement:projects.map((p,i)=>({'@type':'ListItem',position:i+1,item:{'@type':'SoftwareSourceCode',name:p.title,description:p.description,programmingLanguage:p.technologies,...(p.links?.find(l=>safeUrl(l.url))?{url:safeUrl(p.links.find(l=>safeUrl(l.url))!.url)}:{})}}))}}:profile?{'@type':'ProfilePage',inLanguage:locale,url,mainEntity:author}:{'@type':'CollectionPage',name:'Çağatay Duru — Blog',url,inLanguage:locale};
 const breadcrumb={'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Blog',item:absoluteUrl(`/${locale}/`,origin)},...(path===`/${locale}/`?[]:[{'@type':'ListItem',position:2,name:post?.title||(path.includes('/about')?(locale==='tr'?'Hakkımda':'About'):'Portfolio'),item:url}])]};
 return {'@context':'https://schema.org','@graph':[{'@type':'WebSite','@id':absoluteUrl('/#website',origin),name:'Çağatay Duru',url:absoluteUrl('/',origin),inLanguage:['en','tr']},page,breadcrumb]};
}
