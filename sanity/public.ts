import {defineQuery} from 'next-sanity';
import {createClient,type SanityClient} from '@sanity/client';
import type {Locale,Profile,Post,Project,Translation} from '@/lib/types';
export const PUBLIC_QUERY=defineQuery(`{
 "settings":*[_type=="siteSettings" && _id=="siteSettings"][0]{name},
 "profile":*[_type=="profile" && language==$locale][0]{...,"cvUrl":cv.asset->url},
 "projects":*[_type=="project" && language==$locale] | order(order asc,title asc),
 "posts":*[_type=="post" && language==$locale && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc){...,"slug":slug.current},
 "translations":*[_type=="translation.metadata"]{"members":translations[].value->{_id,language,"slug":slug.current}}
}`);
export type PublicSnapshot={settings:{name:string}|null;profile:Profile|null;projects:Project[];posts:Post[];translations:{members:({_id:string}&Translation|null)[]}[]};
export function publicClient(){
 const projectId=process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,dataset=process.env.NEXT_PUBLIC_SANITY_DATASET;
 if(!projectId||!dataset)throw new Error('Sanity is not configured');
 return createClient({projectId,dataset,apiVersion:process.env.NEXT_PUBLIC_SANITY_API_VERSION||'2026-02-01',useCdn:false,perspective:'published',token:undefined,withCredentials:false,stega:false});
}
export function fetchPublished(client:SanityClient,locale:Locale){return client.fetch<PublicSnapshot>(PUBLIC_QUERY,{locale},{perspective:'published',filterResponse:false,stega:false});}
export function relatedTranslations(data:PublicSnapshot,id:string){
 return (data.translations.find(t=>t.members?.some(m=>m?._id===id))?.members||[]).filter((t):t is {_id:string}&Translation=>!!t&&!t._id.startsWith('drafts.')&&(t.language==='en'||t.language==='tr'));
}
