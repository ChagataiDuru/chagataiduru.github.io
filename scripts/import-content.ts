import {loadEnvConfig} from '@next/env';
import {createClient} from '@sanity/client';
import {readFile} from 'node:fs/promises';
import fixtures from '../lib/fixtures.json';
loadEnvConfig(process.cwd());
async function main(){
 const {NEXT_PUBLIC_SANITY_PROJECT_ID:projectId,NEXT_PUBLIC_SANITY_DATASET:dataset,SANITY_API_WRITE_TOKEN:token}=process.env;
 if(!projectId||!dataset||!token)throw new Error('Set project ID, dataset and SANITY_API_WRITE_TOKEN in .env.local. No content was imported.');
 const client=createClient({projectId,dataset,token,apiVersion:'2026-02-01',useCdn:false});
 const [portrait,cv]=await Promise.all([client.assets.upload('image',await readFile('public/portrait.jpeg'),{filename:'portrait.jpeg'}),client.assets.upload('file',await readFile('public/CagatayDuruCV.pdf'),{filename:'CagatayDuruCV.pdf'})]);
 const transaction=client.transaction();
 const docs=[fixtures.settings,...fixtures.profiles,...fixtures.projects];
 for(const doc of docs){
  // Skip any ID already published or drafted. Imports never overwrite editor work.
  const exists=await client.fetch('count(*[_id in $ids])',{ids:[doc._id,`drafts.${doc._id}`]});
  if(exists)continue;
  const record:Record<string,unknown>={...doc,_id:`drafts.${doc._id}`};
  if(doc._type==='profile'){
   delete record.portraitUrl;delete record.cvUrl;
   record.portrait={_type:'image',asset:{_type:'reference',_ref:portrait._id},alt:'Çağatay Duru'};
   record.cv={_type:'file',asset:{_type:'reference',_ref:cv._id}};
   for(const field of ['experience','education','skills'] as const)record[field]=(record[field] as Record<string,unknown>[]).map(entry=>({...entry,_type:'object'}));
   record.contacts=fixtures.profiles[0].contacts.map((c,i)=>({...c,_type:'contactLink',_key:`link${i}`}));
  }
  transaction.createIfNotExists(record as {_id:string;_type:string});
 }
 const groups=['profile',...fixtures.projects.filter(p=>p.language==='en').map(p=>p._id.replace(/-en$/,''))];
 for(const group of groups)transaction.createIfNotExists({_id:`translation-${group}`,_type:'translation.metadata',schemaTypes:[group==='profile'?'profile':'project'],translations:['en','tr'].map(lang=>({_key:lang,_type:'internationalizedArrayReferenceValue',value:{_type:'reference',_ref:`${group}-${lang}`,_weak:true}}))});
 await transaction.commit();
 console.log('Import completed. Profile, settings and seven projects are drafts for review. No posts were created and nothing was published.');
}
main().catch(()=>{console.error('Import failed. Check project configuration, token permissions and connectivity. Drafts may exist if a previous import completed.');process.exitCode=1;});
