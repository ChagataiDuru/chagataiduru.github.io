import {defineEnableDraftMode} from 'next-sanity/draft-mode';
import {NextResponse,type NextRequest} from 'next/server';
import {client} from '@/sanity/client';
import {contentMode} from '@/lib/content';
export async function GET(request:NextRequest){
 if(contentMode()!=='sanity'||!client||!process.env.SANITY_API_READ_TOKEN)return NextResponse.json({error:'Draft preview is not configured.'},{status:503});
 const handler=defineEnableDraftMode({client:client.withConfig({token:process.env.SANITY_API_READ_TOKEN,useCdn:false})});
 return handler.GET(request);
}
