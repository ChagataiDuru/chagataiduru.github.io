import {StructuredData} from '@/components/structured-data';
import {structuredData} from '@/lib/seo';
import {siteUrl} from '@/lib/metadata';
import {notFound} from 'next/navigation';
import {getProfile,getTranslations} from '@/lib/content';
import {isLocale,copy} from '@/lib/i18n';
import {pageMetadata} from '@/lib/metadata';
import {translationPaths,safeUrl} from '@/lib/content-policy';
import {RichText,imageUrl} from '@/components/rich-text';
import {Contacts} from '@/components/contacts';
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props) {
 const {locale}=await params;if(!isLocale(locale))return{};const profile=await getProfile(locale,true);
 return pageMetadata(locale,'/about',copy[locale].about,locale==='en'?'Biography, experience and CV of Çağatay Duru.':'Çağatay Duru’nun özgeçmişi ve deneyimleri.',profile?{...translationPaths(await getTranslations(profile._id),'about'),[locale]:`/${locale}/about`}:{[locale]:`/${locale}/about`});
}
export default async function About({params}:Props){
 const {locale}=await params;if(!isLocale(locale))notFound();const profile=await getProfile(locale),t=copy[locale];
 if(!profile)return <main id="main"><h1>{t.about}</h1><p className="page-intro">{t.missingProfile}</p></main>;
 const portrait=imageUrl(profile.portrait,1100)||safeUrl(profile.portraitUrl),cv=safeUrl(profile.cvUrl);
 return <><StructuredData value={structuredData({locale,path:`/${locale}/about`,origin:siteUrl,profile})}/><main id="main" className="about-page"><section className="about-intro"><div className="biography"><h1>{t.about}</h1><p className="role">{profile.name} · {profile.role}</p><RichText body={profile.bio}/><Contacts contacts={profile.contacts}/>{cv&&<><a className="cv-link" href={cv} download="CagatayDuruCV.pdf">{t.cv}</a>{cv==='/CagatayDuruCV.pdf'&&<span className="cv-source">{t.sourceCV}</span>}</>}</div>{portrait&&<img className="portrait" src={portrait} alt={profile.name} width={534} height={668}/>}</section>
 {profile.reviewNote&&<aside className="review-note"><strong>{t.record}</strong>{profile.reviewNote}</aside>}
 <section className="cv-section"><h2>{t.experience}</h2><div>{(profile.experience||[]).map(e=><div className="experience-item" key={e._key}><h3>{e.organization}</h3><p className="position">{e.role}</p><p className="meta">{e.period}</p><ul>{e.details?.map(d=><li key={d}>{d}</li>)}</ul></div>)}</div></section>
 <section className="cv-section"><h2>{t.education}</h2><div>{(profile.education||[]).map(e=><div className="experience-item" key={e._key}><h3>{e.organization}</h3><p className="position">{e.qualification}</p><p className="meta">{e.period}</p></div>)}</div></section>
 <section className="cv-section"><h2>{t.skills}</h2><div>{(profile.skills||[]).map(s=><div className="skill-group" key={s._key}><h3>{s.label}</h3><p>{s.items?.join(' · ')}</p></div>)}</div></section>
 <section className="cv-section"><h2>{t.contact}</h2><div><p>{t.contactIntro}</p><Contacts contacts={profile.contacts}/></div></section></main></>;
}
