import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {siteUrl} from '@/lib/metadata';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'Çağatay Duru',template:'%s — Çağatay Duru'},icons:{icon:'/favicon.svg'},openGraph:{siteName:'Çağatay Duru'},twitter:{card:'summary'}};
export default async function RootLayout({children}:{children:React.ReactNode}) {
 const lang=(await headers()).get('x-site-locale')==='tr'?'tr':'en';
 return <html lang={lang}><body>{children}</body></html>;
}
