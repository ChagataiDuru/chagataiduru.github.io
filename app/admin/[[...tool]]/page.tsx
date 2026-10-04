import Link from 'next/link';
import {contentMode} from '@/lib/content';
import Studio from './studio';
export const metadata={title:'Content editor — Çağatay Duru',robots:{index:false,follow:false}};
export default function Admin(){
 if(contentMode()==='fixture')return <main className="admin-unconfigured"><h1>Content editor</h1><p>Local fixture mode is active. Sanity is not connected; login, uploads, drafts and publishing are not available yet.</p><ol><li>Create a Sanity project and a public dataset at <a href="https://www.sanity.io/manage">Sanity Manage</a>.</li><li>Copy <code>.env.example</code> to <code>.env.local</code>, add your project ID, dataset and server-side Viewer token.</li><li>Add your local origin to Sanity CORS with credentials enabled, then restart the development server.</li><li>Follow the README to import the profile and projects as drafts.</li></ol><Link href="/en">Return to the website</Link></main>;
 return <Studio/>;
}
