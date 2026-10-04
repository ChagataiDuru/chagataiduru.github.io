import {notFound} from 'next/navigation';
import {draftMode} from 'next/headers';
import {VisualEditing} from 'next-sanity/visual-editing';
import {LanguageProvider} from '@/components/language-context';
import {Header} from '@/components/header';
import {isLocale,copy} from '@/lib/i18n';
import {contentMode,getSettings} from '@/lib/content';
import {live} from '@/sanity/live';
export default async function SiteLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const settings=await getSettings();
 const t=copy[locale],fixture=contentMode()==='fixture',preview=!fixture && !!process.env.SANITY_API_READ_TOKEN && (await draftMode()).isEnabled;
 return <LanguageProvider><a className="skip-link" href="#main">{t.skip}</a><Header locale={locale} name={settings.name}/>{preview&&<div className="preview-banner">{t.preview} · <a href="/api/draft-mode/disable">{t.exit}</a></div>}{children}<footer className="site-footer"><span>© {new Date().getFullYear()} {settings.name}</span>{fixture&&<span className="fixture-label">{t.fixture}</span>}</footer>{!fixture&&live&&<live.SanityLive/>}{preview&&<VisualEditing/>}</LanguageProvider>;
}
