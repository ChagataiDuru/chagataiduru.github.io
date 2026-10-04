import {loadEnvConfig} from '@next/env';
import {createClient} from '@sanity/client';
import {createPublishedId,createDraftId} from '@sanity/id-utils';
import {readFile} from 'node:fs/promises';
import fixtures from '../lib/fixtures.json';
loadEnvConfig(process.cwd());
async function main(){
 const {NEXT_PUBLIC_SANITY_PROJECT_ID:projectId,NEXT_PUBLIC_SANITY_DATASET:dataset,SANITY_API_WRITE_TOKEN:token}=process.env;
 if(!projectId||!dataset||!token)throw new Error('Set project ID, dataset and SANITY_API_WRITE_TOKEN in .env.local.');
 const client=createClient({projectId,dataset,token,apiVersion:'2026-02-01',useCdn:false,perspective:'raw'});
 const [portrait,cv]=await Promise.all([client.assets.upload('image',await readFile('public/portrait.jpeg'),{filename:'portrait.jpeg'}),client.assets.upload('file',await readFile('public/CagatayDuruCV.pdf'),{filename:'CagatayDuruCV.pdf'})]);
 const ids=new Map<string,string>();let created=0,skipped=0;
 for(const doc of [fixtures.settings,...fixtures.profiles,...fixtures.projects]){
  const existing=await client.fetch<{_id:string}|null>(' *[_type==$type && (sourceId==$sourceId || _id in $legacyIds)][0]{_id}',{type:doc._type,sourceId:doc._id,legacyIds:[doc._id,createDraftId(doc._id)]});
  if(existing){ids.set(doc._id,existing._id.replace(/^drafts\./,''));skipped++;continue;}
  const id=doc._type==='project'?createPublishedId():doc._id;
  const record:Record<string,unknown>={...doc,_id:createDraftId(id)};
  if(doc._type==='project')record.sourceId=doc._id;
  if(doc._type==='profile'){
   delete record.portraitUrl;delete record.cvUrl;
   record.portrait={_type:'image',asset:{_type:'reference',_ref:portrait._id},alt:'Çağatay Duru'};
   record.cv={_type:'file',asset:{_type:'reference',_ref:cv._id}};
   for(const field of ['experience','education','skills']as const)record[field]=(record[field]as Record<string,unknown>[]).map(entry=>({...entry,_type:'object'}));
   record.contacts=(doc as typeof fixtures.profiles[number]).contacts.map((c,i)=>({...c,_type:'contactLink',_key:`link${i}`}));
  }
  await client.action({actionType:'sanity.action.document.create',publishedId:id,attributes:record as {_id:string;_type:string},ifExists:'fail'});
  const saved=await client.fetch<{_id:string}>('*[_id==$id][0]{_id}',{id:createDraftId(id)});ids.set(doc._id,saved._id.replace(/^drafts\./,''));created++;
 }
 const groups=['profile',...fixtures.projects.filter(p=>p.language==='en').map(p=>p._id.replace(/-en$/,''))];
 for(const group of groups){const members=['en','tr'].map(lang=>({_key:lang,_type:'internationalizedArrayReferenceValue',value:{_type:'reference',_ref:ids.get(`${group}-${lang}`),_weak:true}}));
  const existing=await client.fetch('count(*[_type=="translation.metadata" && references($ids)])',{ids:members.map(m=>m.value._ref)});
  if(!existing)await client.create({_type:'translation.metadata',schemaTypes:[group==='profile'?'profile':'project'],translations:members});
 }
 console.log(`Import completed: ${created} drafts created, ${skipped} existing documents preserved. Portrait/PDF uploaded and EN/TR translations linked. No posts created; nothing published.`);
}
main().catch((error:{statusCode?:number})=>{console.error('Import failed. Check permissions/configuration/connectivity. Status:',error.statusCode||'unavailable');process.exitCode=1;});
