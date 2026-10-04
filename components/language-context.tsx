'use client';
import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {usePathname} from 'next/navigation';
type ArticleLanguages={path:string;links:Record<string,string>};
const Context=createContext<{article:ArticleLanguages|null;setArticle:(value:ArticleLanguages|null)=>void}>({article:null,setArticle:()=>{}});
export function LanguageProvider({children}:{children:ReactNode}){const [article,setArticle]=useState<ArticleLanguages|null>(null);return <Context.Provider value={{article,setArticle}}>{children}</Context.Provider>;}
export function useArticleLanguages(){const {article}=useContext(Context),path=usePathname();return article?.path===path?article.links:{};}
export function PublishedArticleLanguages({links}:{links:Record<string,string>}){const {setArticle}=useContext(Context),path=usePathname();useEffect(()=>{setArticle({path,links});return()=>setArticle(null);},[path,links,setArticle]);return null;}
