import {Page,metadata} from '../../../lib/page';
export const generateMetadata=()=>metadata('en','blog');
export default function Route(){return <Page locale="en" section="blog"/>;}
