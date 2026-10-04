import {stegaClean} from '@sanity/client/stega';
import type {Body,Locale,Translation} from './types';
export function resolveMode(env:Record<string,string|undefined>) {
  const mode=env.CONTENT_MODE || 'auto';
  if (!['auto','fixture','sanity'].includes(mode)) throw new Error('Invalid CONTENT_MODE');
  if(mode==='fixture') return 'fixture' as const;
  const id=env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset=env.NEXT_PUBLIC_SANITY_DATASET;
  if(!id&&!dataset&&mode==='auto') return 'fixture' as const;
  if(!id || !dataset || !/^[a-z0-9]+$/.test(id) || !/^[a-z0-9_-]+$/.test(dataset)) throw new Error('Incomplete or invalid Sanity configuration');
  return 'sanity' as const;
}
export function translationPaths(translations:Translation[],section:string) {
  return Object.fromEntries(translations.filter(t=>t.language==='en'||t.language==='tr').flatMap(t=>section==='blog' ? (t.slug ? [[t.language,`/${t.language}/blog/${encodeURIComponent(t.slug)}`]]:[]) : [[t.language,`/${t.language}/${section}`]]));
}
export function readingTime(body:Body) {
  const text=stegaClean(body).map(b=>b._type==='block' ? (b as {children?:{text?:string}[]}).children?.map(s=>s.text||'').join(' ') : b._type==='code' ? (b as {code?:string}).code:'').join(' ');
  return Math.max(1,Math.ceil(text.trim().split(/\s+/u).filter(Boolean).length/200));
}
export function safeUrl(value:string|undefined):string|undefined {
  if(!value) return;
  value=stegaClean(value);
  if(/^\/(?!\/)/.test(value)) return value;
  try {const url=new URL(value); if(['https:','http:','mailto:'].includes(url.protocol)) return value;} catch {}
}
export function localeFromPath(path:string):Locale {return path.split('/')[1]==='tr'?'tr':'en';}
