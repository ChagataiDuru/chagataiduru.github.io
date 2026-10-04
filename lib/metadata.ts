import type {Metadata} from 'next';
import type {Locale} from './types';
export const siteUrl=process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export function pageMetadata(locale:Locale,path:string,title:string,description:string,alternates:Record<string,string>):Metadata {
  return {title,description,alternates:{canonical:`/${locale}${path}`,languages:alternates},openGraph:{title,description,locale:locale==='tr'?'tr_TR':'en_US',url:`/${locale}${path}`,type:'website'},robots:{index:true,follow:true}};
}
