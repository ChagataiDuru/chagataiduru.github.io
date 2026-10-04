'use client';
import {PortableText,type PortableTextComponents} from '@portabletext/react';
import {createImageUrlBuilder} from '@sanity/image-url';
import {useEffect,useState} from 'react';
import {safeUrl} from '@/lib/content-policy';
import {projectId,dataset} from '@/sanity/env';
import type {Body,CodeValue,ImageValue} from '@/lib/types';
export function imageUrl(image:ImageValue|undefined,width=1200){return image?.asset?._ref&&projectId&&dataset?createImageUrlBuilder({projectId,dataset}).image(image).width(width).auto('format').url():undefined;}
function CodeBlock({value}:{value:CodeValue}){
 const [html,setHtml]=useState('');
 useEffect(()=>{let active=true;import('shiki').then(async({codeToHtml})=>{let result;try{result=await codeToHtml(value.code||'',{lang:value.language||'text',theme:'github-light'});}catch{result=await codeToHtml(value.code||'',{lang:'text',theme:'github-light'});}if(active)setHtml(result);}).catch(()=>{});return()=>{active=false;};},[value.code,value.language]);
 return <div className="code-block">{value.filename&&<div className="code-label">{value.filename}</div>}{html?<div dangerouslySetInnerHTML={{__html:html}}/>:<pre><code>{value.code}</code></pre>}</div>;
}
const components:PortableTextComponents={types:{code:CodeBlock,image:({value}:{value:ImageValue})=>{const src=imageUrl(value);return src?<figure><img src={src} alt={value.alt||''} loading="lazy"/>{value.caption&&<figcaption>{value.caption}</figcaption>}</figure>:null;}},marks:{link:({value,children})=>{const href=safeUrl(value?.href);return href?<a href={href} rel="noopener noreferrer">{children}</a>:<>{children}</>;}}};
export function RichText({body}:{body:Body|undefined}){return <div className="prose"><PortableText value={body||[]} components={components}/></div>;}
