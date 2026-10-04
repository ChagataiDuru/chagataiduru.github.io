import {resolveMode} from '@/lib/content-policy';
import {PagesStudio} from './studio';
export const metadata={title:'Content editor — Çağatay Duru',robots:{index:false,follow:false}};
export default function Admin(){return resolveMode({...process.env,CONTENT_MODE:'auto'})==='sanity'?<PagesStudio/>:<main className="admin-unconfigured"><h1>Sanity is not connected</h1><p>The site uses imported fixture content. Publishing and uploads are unavailable until a Sanity project is configured.</p><p>Follow the README to configure the project, dataset and CORS origins, then rebuild the editor once.</p><a href="/en/">Return to the site</a></main>;}
