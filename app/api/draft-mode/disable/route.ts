import {draftMode} from 'next/headers';
import {NextResponse} from 'next/server';
import {siteUrl} from '@/lib/metadata';
export async function GET(){(await draftMode()).disable();return NextResponse.redirect(new URL('/en',siteUrl));}
