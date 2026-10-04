import type {PortableTextBlock} from '@portabletext/types';
export type Locale = 'en' | 'tr';
export type ImageValue = {asset?: {_ref?: string}; alt?: string; caption?: string};
export type CodeValue = {_type:'code'; _key:string; code:string; language?:string; filename?:string};
export type Body = (PortableTextBlock | (ImageValue & {_type:'image'; _key:string}) | CodeValue)[];
export type Contact = {label:string; url:string};
export type Profile = {
  _id:string; name:string; role:string; language:Locale; bio:Body; portrait?:ImageValue; portraitUrl?:string; cvUrl?:string;
  contacts:Contact[]; reviewNote?:string; needsReview?:boolean;
  experience:{_key:string; organization:string; role:string; period:string; details:string[]}[];
  education:{_key:string; organization:string; qualification:string; period:string}[];
  skills:{_key:string; label:string; items:string[]}[];
};
export type Project = {_id:string; title:string; language:Locale; description:string; technologies:string[]; period?:string; order:number; links?:Contact[]};
export type Post = {_id:string; title:string; language:Locale; slug:string; excerpt:string; publishedAt:string; tags?:string[]; body:Body; cover?:ImageValue};
export type Translation = {language:Locale; slug?:string};
