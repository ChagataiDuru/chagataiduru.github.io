import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import {articlePath,publishedArticleLinks,jsonLd,structuredData} from '../lib/seo';
import {fetchPublished,publicClient,relatedTranslations,type PublicSnapshot} from '../sanity/public';
import {PublicPage} from '../components/pages/runtime';
import fixtures from '../lib/fixtures.json';
import type {Profile,Project} from '../lib/types';
const data:PublicSnapshot={settings:fixtures.settings,profile:fixtures.profiles[0] as Profile,projects:fixtures.projects.filter(p=>p.language==='en')as Project[],posts:[],translations:[{members:[{_id:'profile-en',language:'en'},{_id:'profile-tr',language:'tr'},null]}]};
test('query article URLs preserve Turkish characters and encode URL delimiters',()=>{
 const path=articlePath('tr','çağatay & kod?');assert.equal(new URL(path,'https://example.com').searchParams.get('slug'),'çağatay & kod?');assert.ok(path.startsWith('/tr/blog/?slug='));
 assert.deepEqual(publishedArticleLinks([{language:'en',slug:'code'},{language:'tr'}]),{en:'/en/blog/?slug=code'});
});
test('related language links omit drafts and absent published references',()=>{
 const snapshot={...data,translations:[{members:[{_id:'post-en',language:'en' as const,slug:'one'},{_id:'drafts.post-tr',language:'tr' as const,slug:'iki'},null]}]};
 assert.deepEqual(relatedTranslations(snapshot,'post-en').map(t=>t.language),['en']);
 assert.deepEqual(relatedTranslations(snapshot,'missing'),[]);
});
test('JSON-LD escapes script termination and does not invent career dates',()=>{
 assert.equal(jsonLd({name:'</script><script>bad</script>'}).includes('<'),false);
 const value=structuredData({locale:'en',path:'/en/about/',origin:'https://example.com',profile:data.profile});
 assert.ok(JSON.stringify(value).includes('Software Engineer'));assert.ok(!JSON.stringify(value).includes('worksFor'));assert.ok(!JSON.stringify(value).includes('alumniOf'));
});
test('public reads explicitly select published content and omit privileged tokens',async()=>{
 const previous={id:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET,token:process.env.SANITY_API_READ_TOKEN};
 process.env.NEXT_PUBLIC_SANITY_PROJECT_ID='testproj';process.env.NEXT_PUBLIC_SANITY_DATASET='production';process.env.SANITY_API_READ_TOKEN='private-token-must-not-propagate';
 try{const client=publicClient();assert.equal(client.config().perspective,'published');assert.equal(client.config().token,undefined);assert.equal(client.config().withCredentials,false);let captured:unknown[]=[];
 const fake={fetch:async(...args:unknown[])=>{captured=args;return {result:data,syncTags:['tag']};}};
 await fetchPublished(fake as unknown as typeof client,'tr');assert.deepEqual(captured[1],{locale:'tr'});assert.deepEqual(captured[2],{perspective:'published',filterResponse:false,stega:false});
 }finally{for(const [key,value]of Object.entries({NEXT_PUBLIC_SANITY_PROJECT_ID:previous.id,NEXT_PUBLIC_SANITY_DATASET:previous.dataset,SANITY_API_READ_TOKEN:previous.token})){if(value===undefined)delete process.env[key];else process.env[key]=value;}}
});
test('public fixture HTML has crawlable CV, project links and person schema',()=>{
 const html=renderToStaticMarkup(<PublicPage locale="en" section="about" initial={data} mode="fixture" origin="https://example.com"/>);
 assert.ok(html.includes('href="/CagatayDuruCV.pdf"'));assert.ok(html.includes('application/ld+json'));assert.ok(html.includes('ProfilePage'));assert.ok(html.includes('Sanity is not connected'));assert.ok(!html.includes('private-token'));
});

test('live public transport handles publish, update, unpublish and failure without a build',async()=>{
 const {watchPublished}=await import('../sanity/watch-published');
 const {setImmediate}=await import('node:timers/promises');
 let published:PublicSnapshot={...data},event:((value:{type:string;tags?:string[]})=>void)|undefined,failed=false,errors=0,unsubscribed=false,calls=0;
 const deliveries:PublicSnapshot[]=[];
 const fake={fetch:async(_q:unknown,_p:unknown,options:{perspective:string})=>{assert.equal(options.perspective,'published');calls++;if(failed)throw Error('offline');return {result:published,syncTags:['content']};},live:{events:(options:{includeDrafts:boolean})=>{assert.equal(options.includeDrafts,false);return {subscribe:({next}:{next:typeof event})=>{event=next;return {unsubscribe:()=>{unsubscribed=true;}};}};}}};
 const watcher=watchPublished(fake as unknown as ReturnType<typeof publicClient>,'en',v=>deliveries.push(v),()=>errors++);
 try{await setImmediate();assert.equal(deliveries.at(-1)?.posts.length,0);
 const post={_id:'test',title:'Published',language:'en' as const,slug:'test',excerpt:'Test',publishedAt:'2026-10-04T00:00:00Z',body:[]};
 published={...data,posts:[post]};event!({type:'message',tags:['content']});await setImmediate();assert.equal(deliveries.at(-1)?.posts[0].title,'Published');
 published={...published,posts:[{...post,title:'Updated'}]};event!({type:'message',tags:['content']});await setImmediate();assert.equal(deliveries.at(-1)?.posts[0].title,'Updated');
 published={...data,posts:[]};event!({type:'message',tags:['content']});await setImmediate();assert.equal(deliveries.at(-1)?.posts.length,0);
 const before=calls;event!({type:'message',tags:['unrelated']});await setImmediate();assert.equal(calls,before);
 failed=true;await watcher.refresh();assert.equal(errors,1);failed=false;event!({type:'reconnect'});await setImmediate();assert.equal(deliveries.at(-1)?.posts.length,0);
 }finally{watcher.stop();}assert.ok(unsubscribed);
});
