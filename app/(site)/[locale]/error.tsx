'use client';
import {usePathname} from 'next/navigation';
import {copy} from '@/lib/i18n';
import {localeFromPath} from '@/lib/content-policy';
export default function ErrorPage({retry}:{error:Error;retry:()=>void}){const t=copy[localeFromPath(usePathname())];return <main id="main" className="error-page" role="alert"><h1>{t.error}</h1><p>{t.errorText}</p><button onClick={retry}>{t.retry}</button></main>;}
