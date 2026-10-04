import type {Contact} from '@/lib/types';
import {safeUrl} from '@/lib/content-policy';
export function Contacts({contacts}:{contacts:Contact[]|undefined}) {return <div className="contact-links">{(contacts||[]).map(c=>safeUrl(c.url)?<a key={c.url} href={safeUrl(c.url)}>{c.label}</a>:null)}</div>;}
