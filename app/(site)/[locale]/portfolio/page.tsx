import {StructuredData} from '@/components/structured-data';
import {structuredData} from '@/lib/seo';
import {siteUrl} from '@/lib/metadata';
import {notFound} from 'next/navigation';
import {getProjects,getTranslations,contentMode} from '@/lib/content';
import {isLocale,copy} from '@/lib/i18n';
import {pageMetadata} from '@/lib/metadata';
import {Contacts} from '@/components/contacts';
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props){const {locale}=await params;if(!isLocale(locale))return{};const projects=await getProjects(locale,true);const available=contentMode()==='fixture'||(await Promise.all(projects.map(p=>getTranslations(p._id)))).flat().some(t=>t.language!==locale);return pageMetadata(locale,'/portfolio',copy[locale].portfolio,copy[locale].projectsIntro,available?{en:'/en/portfolio',tr:'/tr/portfolio'}:{[locale]:`/${locale}/portfolio`});}
export default async function Portfolio({params}:Props){
 const {locale}=await params;if(!isLocale(locale))notFound();const projects=await getProjects(locale),t=copy[locale];
 return <><StructuredData value={structuredData({locale,path:`/${locale}/portfolio`,origin:siteUrl,projects})}/><main id="main" className="portfolio-page"><h1>{t.portfolio}</h1><p className="page-intro">{t.projectsIntro}</p>{locale==='tr'&&contentMode()==='fixture'&&<p className="meta" style={{marginBottom:24}}>{t.translationReview}</p>}{projects.length?projects.map((p,i)=><article className="project-row" key={p._id}><span className="project-number">{String(i+1).padStart(2,'0')}</span><div><div className="project-heading"><h2>{p.title}</h2>{p.period&&<span className="meta">{p.period}</span>}</div><p>{p.description}</p><p className="technologies">{p.technologies?.join(' · ')}</p>{!!p.links?.length&&<Contacts contacts={p.links}/>}</div></article>):<p>{t.missingProjects}</p>}</main></>;
}
