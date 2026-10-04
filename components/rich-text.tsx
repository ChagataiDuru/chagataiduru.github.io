import {PortableText,type PortableTextComponents} from '@portabletext/react';
import {createImageUrlBuilder} from '@sanity/image-url';
import {stegaClean} from '@sanity/client/stega';
import {codeToHtml} from 'shiki';
import {projectId,dataset} from '@/sanity/env';
import {safeUrl} from '@/lib/content-policy';
import type {Body,ImageValue,CodeValue} from '@/lib/types';
export function imageUrl(image:ImageValue|undefined,width=1200):string|undefined {
 if(!image?.asset?._ref||!projectId||!dataset) return;
 return createImageUrlBuilder({projectId,dataset}).image(stegaClean(image)).width(width).auto('format').url();
}
export async function CodeBlock({value}:{value:CodeValue}) {
 let html:string;
 try{html=await codeToHtml(stegaClean(value.code||''),{lang:stegaClean(value.language||'text'),theme:'github-light'});}catch{html=await codeToHtml(stegaClean(value.code||''),{lang:'text',theme:'github-light'});}
 // Shiki escapes source code; no authored HTML is evaluated.
 return <div className="code-block">{value.filename&&<div className="code-label">{value.filename}</div>}<div dangerouslySetInnerHTML={{__html:html}}/></div>;
}
const components:PortableTextComponents={
 types:{image:({value}:{value:ImageValue})=>{const url=imageUrl(value);return url?<figure><img src={url} alt={value.alt||''} loading="lazy"/>{value.caption&&<figcaption>{value.caption}</figcaption>}</figure>:null;},code:CodeBlock},
 marks:{link:({value,children})=>{const href=safeUrl(value?.href);return href?<a href={href} rel={href.startsWith('http')?'noopener noreferrer':undefined}>{children}</a>:<>{children}</>;}}
};
export function RichText({body}:{body:Body|undefined}) {return <div className="prose"><PortableText value={body||[]} components={components}/></div>;}
