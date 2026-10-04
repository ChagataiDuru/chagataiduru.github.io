import type {SanityClient} from '@sanity/client';
import type {Locale} from '@/lib/types';
import {fetchPublished,type PublicSnapshot} from './public';
// Tokens and draft perspectives are never accepted by this public subscription.
export function watchPublished(client:SanityClient,locale:Locale,onData:(data:PublicSnapshot)=>void,onError:()=>void){
 let active=true,version=0,tags:string[]=[];
 async function refresh(){const request=++version;try{const result=await fetchPublished(client,locale);if(active&&request===version){tags=result.syncTags||[];onData(result.result);}}catch{if(active&&request===version)onError();}}
 const subscription=client.live.events({includeDrafts:false}).subscribe({next:event=>{if(event.type==='message'){if(!tags.length||event.tags.some(t=>tags.includes(t)))void refresh();}else if(['welcome','restart','reconnect'].includes(event.type))void refresh();},error:()=>{/* Polling covers environments that block SSE. */}});
 void refresh();const interval=setInterval(()=>void refresh(),30000);
 return {refresh,stop(){active=false;version++;subscription.unsubscribe();clearInterval(interval);}};
}
