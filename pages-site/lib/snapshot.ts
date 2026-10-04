import 'server-only';
import {cache} from 'react';
import fixtures from '@/lib/fixtures.json';
import {resolveMode} from '@/lib/content-policy';
import {publicClient,fetchPublished,type PublicSnapshot} from '@/sanity/public';
import type {Locale,Profile,Project} from '@/lib/types';
export const mode=()=>resolveMode(process.env);
export const snapshot=cache(async(locale:Locale):Promise<PublicSnapshot>=>{
 if(mode()==='sanity')return (await fetchPublished(publicClient(),locale)).result;
 return {settings:fixtures.settings,profile:fixtures.profiles.find(p=>p.language===locale) as Profile||null,projects:fixtures.projects.filter(p=>p.language===locale) as Project[],posts:[],translations:[{members:fixtures.profiles.map(p=>({_id:p._id,language:p.language as Locale}))}]};
});
