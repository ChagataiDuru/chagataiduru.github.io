import 'server-only';
import {cache} from 'react';
import {defineQuery} from 'next-sanity';
import {live} from '@/sanity/live';
import fixtures from './fixtures.json';
import {resolveMode} from './content-policy';
import type {Locale,Profile,Project,Post,Translation} from './types';
export const contentMode = () => resolveMode(process.env);
const PROFILE=defineQuery(`*[_type=="profile" && language==$locale][0]{..., "cvUrl": cv.asset->url}`);
const PROJECTS=defineQuery(`*[_type=="project" && language==$locale] | order(order asc, title asc)`);
const POSTS=defineQuery(`*[_type=="post" && language==$locale && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc){..., "slug":slug.current}`);
const POST=defineQuery(`*[_type=="post" && language==$locale && slug.current==$slug][0]{..., "slug":slug.current}`);
const TRANSLATIONS=defineQuery(`*[_type=="translation.metadata" && references($id)][0].translations[].value->{language,"slug":slug.current}`);
async function query<T>(q:string,params:Record<string,string>,published=false):Promise<T> {
  if(!live) throw new Error('Sanity is not configured');
  const result=await live.sanityFetch({query:q,params,...(published?{perspective:'published' as const,stega:false}:{})});
  return result.data as T;
}
export const getProfile=cache(async(locale:Locale,published=false):Promise<Profile|null> => contentMode()==='fixture' ? fixtures.profiles.find(p=>p.language===locale) as Profile||null : query(PROFILE,{locale},published));
export const getProjects=cache(async(locale:Locale,published=false):Promise<Project[]> => contentMode()==='fixture' ? fixtures.projects.filter(p=>p.language===locale) as Project[] : query(PROJECTS,{locale},published));
export const getPosts=cache(async(locale:Locale,published=false):Promise<Post[]> => contentMode()==='fixture' ? [] : query(POSTS,{locale},published));
export const getPost=cache(async(locale:Locale,slug:string,published=false):Promise<Post|null> => contentMode()==='fixture' ? null : query(POST,{locale,slug},published));
export const getTranslations=cache(async(id:string):Promise<Translation[]> => {
  if(contentMode()==='fixture') return [{language:'en'},{language:'tr'}];
  // Always resolve navigation from the published perspective, including in preview.
  const docs=await query<(Translation|null)[]|null>(TRANSLATIONS,{id:id.replace(/^drafts\./,'')},true);
  return (docs||[]).filter((d):d is Translation=>!!d && (d.language==='en'||d.language==='tr'));
});

export const getSettings=cache(async():Promise<{name:string}> => contentMode()==='fixture' ? fixtures.settings : (await query<{name:string}|null>('*[_type=="siteSettings" && _id=="siteSettings"][0]{name}',{})) || {name:'Çağatay Duru'});
