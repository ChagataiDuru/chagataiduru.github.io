'use client';
import dynamic from 'next/dynamic';
export const PagesStudio=dynamic(()=>import('./studio-client'),{ssr:false,loading:()=> <p style={{padding:30}}>Loading editor…</p>});
