import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {loadEnvConfig} from '@next/env';
import {createClient} from '@sanity/client';
import {createPublishedId,createDraftId} from '@sanity/id-utils';
import {createPreviewSecret} from '@sanity/preview-url-secret/create-secret';
import {urlSearchParamPreviewSecret,urlSearchParamPreviewPathname,urlSearchParamPreviewPerspective} from '@sanity/preview-url-secret/constants';
import fixtures from '../lib/fixtures.json';
loadEnvConfig(process.cwd());
const projectId=process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,dataset=process.env.NEXT_PUBLIC_SANITY_DATASET,token=process.env.SANITY_API_READ_TOKEN;
const config={projectId,dataset,apiVersion:'2026-02-01',useCdn:false};
const auth=createClient({...config,token,perspective:'raw'}),pub=createClient({...config,perspective:'published',withCredentials:false});
const origin=process.env.CATOSITE_CHECK_ORIGIN||'http://127.0.0.1:3000';
async function main(){
 const profiles=await auth.fetch('*[_type=="profile"]');const projects=await auth.fetch('*[_type=="project"]');
 assert.equal(profiles.length,2);assert.equal(projects.length,14);assert.equal(await auth.fetch('count(*[_type=="post"])'),0);assert.equal(await auth.fetch('count(*[_type=="translation.metadata"])'),8);
 for(const profile of profiles){const original=fixtures.profiles.find(p=>p.language===profile.language)!;assert.equal(profile.role,'Software Engineer');assert.deepEqual(profile.bio,original.bio);assert.deepEqual(profile.experience.map(({_type,...rest}:Record<string,unknown>)=>rest),original.experience);assert.ok(profile.needsReview);assert.equal(profile.reviewNote,original.reviewNote);}
 for(const project of projects){const original=fixtures.projects.find(p=>p._id===project.sourceId)!;assert.ok(original);assert.equal(project.description,original.description);assert.deepEqual(project.technologies,original.technologies);assert.ok(project.needsReview);}
 console.log('PASS imported EN/TR content, dated review notes, seven projects per language; no posts invented');
 const profile=profiles.find((p:{language:string})=>p.language==='en');const cv=await auth.fetch('*[_id==$id][0].cv.asset->url',{id:profile._id});assert.ok(Buffer.from(await(await fetch(cv)).arrayBuffer()).equals(await readFile('public/CagatayDuruCV.pdf')));console.log('PASS uploaded CV bytes match source');
 for(const doc of [...profiles,...projects].filter((d:{_id:string})=>d._id.startsWith('drafts.'))){assert.equal(await pub.fetch('*[_id==$id][0]',{id:doc._id},{perspective:'raw'}),null);}
 console.log('PASS unauthenticated raw queries cannot retrieve imported drafts');
 try{await pub.patch(createDraftId('profile-en')).set({role:'Software Engineer'}).commit({dryRun:true});throw Error('Anonymous mutation unexpectedly permitted');}catch(e){assert.ok([401,403].includes((e as {statusCode?:number}).statusCode||0));}
 console.log('PASS unauthenticated edit rejected (dry-run, no mutation persisted)');
 const forged=await fetch(`${origin}/api/draft-mode/enable?sanity-preview-secret=invalid`,{redirect:'manual'});assert.equal(forged.status,401);assert.ok(!forged.headers.get('set-cookie'));console.log('PASS forged preview secret rejected');
 const secretId=createPublishedId();try{
  const {secret}=await createPreviewSecret(auth,'CatoSite verification',`${origin}/admin`,undefined,secretId);const url=new URL('/api/draft-mode/enable',origin);url.searchParams.set(urlSearchParamPreviewSecret,secret);url.searchParams.set(urlSearchParamPreviewPathname,'/en/about');url.searchParams.set(urlSearchParamPreviewPerspective,'drafts');
  const response=await fetch(url,{redirect:'manual'});assert.ok([302,307].includes(response.status));const cookies=response.headers.getSetCookie();const bypass=cookies.find(c=>c.startsWith('__prerender_bypass='));assert.ok(bypass?.includes('HttpOnly'));const cookie=cookies.map(c=>c.split(';')[0]).join('; ');
  const preview=await(await fetch(`${origin}/en/about`,{headers:{cookie}})).text();assert.ok(preview.includes('Draft preview'));assert.ok(preview.includes('Download CV'));
  const publicHtml=await(await fetch(`${origin}/en/about`)).text();assert.ok(!publicHtml.includes('Draft preview'));assert.ok(!publicHtml.includes('Download CV'));
  const spoofed=await(await fetch(`${origin}/en/about`,{headers:{cookie:'__prerender_bypass=forged; sanity-preview-perspective=drafts'}})).text();assert.ok(!spoofed.includes('Download CV'));console.log('PASS authenticated preview handshake reads draft; separate public and forged-cookie requests do not');
  const exit=await fetch(`${origin}/api/draft-mode/disable`,{headers:{cookie},redirect:'manual'});assert.ok(exit.headers.getSetCookie().some(c=>c.startsWith('__prerender_bypass=')&&(/Max-Age=0|Expires=Thu, 01 Jan 1970/i).test(c)));console.log('PASS exiting preview clears cookie');
 }finally{await auth.delete(createDraftId(secretId));}
}
main().catch((e:{statusCode?:number;message?:string})=>{console.error('CMS verification failed:',e.statusCode||e.message?.replaceAll(token||'__absent__','[redacted]'));process.exitCode=1;});
