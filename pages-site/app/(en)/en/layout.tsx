import '@/app/globals.css';
export const metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://chagataiduru.github.io'),icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
