'use client';
import {useState} from 'react';
import {Studio} from 'sanity';
import {createHashHistory} from 'history';
import config from '@/sanity.config';
export default function PagesStudio(){const [history]=useState(()=>{if(!window.location.hash)window.history.replaceState(null,'',`${window.location.pathname}#/admin`);return createHashHistory();});return <div style={{position:'fixed',inset:0}}><Studio config={config} unstable_history={history}/></div>;}
