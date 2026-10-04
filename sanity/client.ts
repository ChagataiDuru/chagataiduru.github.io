import {createClient} from 'next-sanity';
import {projectId,dataset,apiVersion} from './env';
export const client = projectId && dataset ? createClient({projectId,dataset,apiVersion,useCdn:true,perspective:'published',stega:{studioUrl:'/admin'}}) : null;
