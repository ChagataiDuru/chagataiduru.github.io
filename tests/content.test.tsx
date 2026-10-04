import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import React from 'react';
import {resolveMode,translationPaths,safeUrl,readingTime} from '../lib/content-policy';
import fixtures from '../lib/fixtures.json';
import {CodeBlock,RichText} from '../components/rich-text';
import type {Body} from '../lib/types';
test('missing credentials select explicit fixture mode; partial configuration fails closed',()=>{
 assert.equal(resolveMode({}),'fixture');
 assert.equal(resolveMode({CONTENT_MODE:'fixture',NEXT_PUBLIC_SANITY_PROJECT_ID:'abc'}),'fixture');
 assert.throws(()=>resolveMode({NEXT_PUBLIC_SANITY_PROJECT_ID:'abc'}));
 assert.throws(()=>resolveMode({CONTENT_MODE:'sanity'}));
 assert.throws(()=>resolveMode({CONTENT_MODE:'wrong'}));
 assert.equal(resolveMode({NEXT_PUBLIC_SANITY_PROJECT_ID:'abc',NEXT_PUBLIC_SANITY_DATASET:'production'}),'sanity');
});
test('translation links use related localized slugs and omit unavailable versions',()=>{
 assert.deepEqual(translationPaths([{language:'en',slug:'hello'}],'blog'),{en:'/en/blog/hello'});
 assert.deepEqual(translationPaths([{language:'tr',slug:'türkçe-yazı'}],'blog'),{tr:'/tr/blog/t%C3%BCrk%C3%A7e-yaz%C4%B1'});
 assert.deepEqual(translationPaths([{language:'tr'}],'blog'),{});
});
test('import has seven projects per language, no invented posts and no placeholder URLs',()=>{
 assert.equal(fixtures.posts.length,0);
 for(const language of ['en','tr'])assert.equal(fixtures.projects.filter(p=>p.language===language).length,7);
 assert.equal(fixtures.profiles[0].role,'Software Engineer');
 assert.ok(fixtures.profiles.every(p=>p.reviewNote&&p.needsReview));
 assert.equal(JSON.stringify(fixtures).includes('"#"'),false);
 assert.ok(fixtures.profiles.find(p=>p.language==='tr')?.bio.some(b=>b.children.some(c=>c.text.includes('Özyeğin'))));
});
test('authored URLs reject executable and protocol-relative targets',()=>{
 assert.equal(safeUrl('javascript:alert(1)'),undefined);assert.equal(safeUrl('//evil.example'),undefined);
 assert.equal(safeUrl('data:text/html,hello'),undefined);assert.equal(safeUrl('/CagatayDuruCV.pdf'),'/CagatayDuruCV.pdf');
 assert.equal(safeUrl('https://github.com/ChagataiDuru'),'https://github.com/ChagataiDuru');
});
test('highlighted code is escaped, supports Turkish characters and unknown languages',async()=>{
 const html=renderToStaticMarkup(await CodeBlock({value:{_type:'code',_key:'c',language:'typescript',code:'const başlık = "<script>alert(1)</script>";'}}));
 assert.match(html,/shiki/);assert.match(html,/başlık/);assert.doesNotMatch(html,/<script>/);assert.match(html,/&#x3C;|&lt;/);
 const fallback=renderToStaticMarkup(await CodeBlock({value:{_type:'code',_key:'x',language:'not-a-language',code:'Türkçe <test>'}}));
 assert.match(fallback,/Türkçe/);assert.doesNotMatch(fallback,/<test>/);
});
test('rich text headings, lists and unsafe links render safely',()=>{
 const body:Body=[{_type:'block',_key:'h',style:'h2',markDefs:[],children:[{_type:'span',_key:'s',text:'Örnek başlık',marks:[]}]},{_type:'block',_key:'l',style:'normal',listItem:'bullet',level:1,markDefs:[{_type:'link',_key:'bad',href:'javascript:alert(1)'}],children:[{_type:'span',_key:'s',text:'List item',marks:['bad']}]}];
 const html=renderToStaticMarkup(<RichText body={body}/>);assert.match(html,/<h2>Örnek başlık/);assert.match(html,/<ul>/);assert.doesNotMatch(html,/javascript:/);
 assert.equal(readingTime(body),1);
});
