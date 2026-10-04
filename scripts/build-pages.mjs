import {cp,mkdir,rm,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import env from '@next/env';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');env.loadEnvConfig(root);
const folder=path.join(root,'pages-site');await rm(path.join(folder,'public'),{recursive:true,force:true});await mkdir(path.join(folder,'public'),{recursive:true});await cp(path.join(root,'public'),path.join(folder,'public'),{recursive:true});await writeFile(path.join(folder,'public','.nojekyll'),'');
const childEnv={...process.env,NEXT_PUBLIC_STATIC_PAGES:'true',NEXT_PUBLIC_SITE_URL:process.env.NEXT_PUBLIC_SITE_URL||'https://chagataiduru.github.io'};delete childEnv.SANITY_API_READ_TOKEN;delete childEnv.SANITY_API_WRITE_TOKEN;
const result=spawnSync(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'build'],{cwd:folder,env:childEnv,stdio:'inherit'});process.exit(result.status??1);
