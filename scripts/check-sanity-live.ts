import assert from 'node:assert/strict';
import {loadEnvConfig} from '@next/env';
import {createClient,type SanityClient} from '@sanity/client';
import {createPublishedId,createDraftId} from '@sanity/id-utils';
import {publicClient,relatedTranslations,type PublicSnapshot} from '../sanity/public';
import {watchPublished} from '../sanity/watch-published';
loadEnvConfig(process.cwd());
if(!process.argv.includes('--disposable-probe'))throw Error('Use --disposable-probe to create technical verification documents that never appear on the website.');
const auth=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET,token:process.env.SANITY_API_WRITE_TOKEN,apiVersion:'2026-02-01',useCdn:false,perspective:'raw'});
const pub=publicClient(),group=createPublishedId(),enId=createPublishedId(),trId=createPublishedId();
const query=`{"settings":null,"profile":null,"posts":[],"projects":*[_type=="catoVerification" && verificationGroup==$group && language=="en"]{_id,title,language,"description":"Technical verification only","technologies":[],"order":counter},"translations":[{"members":*[_type=="catoVerification" && verificationGroup==$group]{_id,language}}]}`;
const delay=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
async function main(){
 // The SDK and watchPublished code are real; only the query is scoped to isolated probes.
 // No profile, project, post or translation.metadata document is created or changed.
 const adapter={fetch:(_query:string,_params:unknown,options:unknown)=>pub.fetch(query,{group},options as Parameters<typeof pub.fetch>[2]),live:pub.live} as unknown as SanityClient;
 let latest:PublicSnapshot|undefined,failures=0;const snapshots:PublicSnapshot[]=[];
 const watcher=watchPublished(adapter,'en',v=>{latest=v;snapshots.push(v);},()=>failures++);
 async function waitFor(check:()=>boolean){const deadline=Date.now()+15000;while(Date.now()<deadline){if(check())return;await delay(100);}throw Error('No live update within 15 seconds; 30-second polling is excluded.');}
 const publish=(id:string)=>auth.action({actionType:'sanity.action.document.publish',publishedId:id,draftId:createDraftId(id)});
 const unpublish=(id:string)=>auth.action({actionType:'sanity.action.document.unpublish',publishedId:id,draftId:createDraftId(id)});
 try{
  for(const [id,language]of [[enId,'en'],[trId,'tr']])await auth.action({actionType:'sanity.action.document.create',publishedId:id,attributes:{_id:createDraftId(id),_type:'catoVerification',verificationGroup:group,language,title:'CatoSite technical verification',counter:0},ifExists:'fail'});
  await waitFor(()=>!!latest);assert.equal(latest!.projects.length,0);
  await publish(enId);await waitFor(()=>!!latest!.projects.find(p=>p._id===enId));assert.deepEqual(relatedTranslations(latest!,enId).map(t=>t.language),['en']);console.log('PASS real publish triggers draft-free live transport; unpublished counterpart excluded');
  await auth.action({actionType:'sanity.action.document.edit',publishedId:enId,draftId:createDraftId(enId),patch:{set:{counter:1}}});await publish(enId);await waitFor(()=>latest!.projects.find(p=>p._id===enId)?.order===1);console.log('PASS real published update arrives without build or polling');
  await publish(trId);await waitFor(()=>relatedTranslations(latest!,enId).length===2);console.log('PASS independent counterpart publication becomes available live');
  await unpublish(trId);await waitFor(()=>relatedTranslations(latest!,enId).length===1);console.log('PASS unpublished counterpart disappears live');
  await unpublish(enId);await waitFor(()=>latest!.projects.length===0);assert.equal(failures,0);console.log('PASS real unpublish removes content live; snapshots:',snapshots.length);
 }finally{
  watcher.stop();const cleanup=auth.transaction();for(const id of [enId,trId]){cleanup.delete(id);cleanup.delete(createDraftId(id));}await cleanup.commit();
  assert.equal(await auth.fetch('count(*[_type=="catoVerification" && verificationGroup==$group])',{group}),0);console.log('Disposable verification records removed; imported content untouched.');
 }
}
main().catch((e:{statusCode?:number;message?:string})=>{console.error('Live verification failed:',e.statusCode||e.message?.replaceAll(process.env.SANITY_API_WRITE_TOKEN||'__absent__','[redacted]'));process.exitCode=1;});
