import Link from 'next/link';
import {headers} from 'next/headers';
import {copy} from '@/lib/i18n';
export default async function NotFound(){const locale=(await headers()).get('x-site-locale')==='tr'?'tr':'en',t=copy[locale];return <main id="main" className="error-page"><h1>{t.notFound}</h1><p>{t.notFoundText}</p><Link href={`/${locale}`}>{t.back}</Link></main>;}
