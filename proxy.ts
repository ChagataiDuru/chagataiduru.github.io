import {NextResponse,type NextRequest} from 'next/server';
export function proxy(request:NextRequest) {
  const headers=new Headers(request.headers);
  headers.set('x-site-locale',request.nextUrl.pathname.split('/')[1]==='tr'?'tr':'en');
  return NextResponse.next({request:{headers}});
}
export const config={matcher:['/((?!_next|.*\\..*|api).*)']};
