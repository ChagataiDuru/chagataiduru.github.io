import {Page,metadata} from '../../../../lib/page';
export const generateMetadata=()=>metadata('en','about');
export default function Route(){return <Page locale="en" section="about"/>;}
