'use client';
import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {presentationTool,defineLocations} from 'sanity/presentation';
import {documentInternationalization} from '@sanity/document-internationalization';
import {schemaTypes} from './sanity/schema';
import {projectId,dataset,apiVersion} from './sanity/env';
export default defineConfig({
 name:'cagatay-duru',title:'Çağatay Duru',basePath:'/admin',projectId,dataset,
 plugins:[structureTool({structure:S=>S.list().title('Content').items([
 S.listItem().title('Site settings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
 S.listItem().title('English profile / CV').child(S.document().schemaType('profile').documentId('profile-en')),
 S.listItem().title('Türkçe profil / CV').child(S.document().schemaType('profile').documentId('profile-tr')),
 ...S.documentTypeListItems().filter(item=>!['siteSettings','profile','translation.metadata'].includes(item.getId()||''))
 ])}),documentInternationalization({supportedLanguages:[{id:'en',title:'English'},{id:'tr',title:'Türkçe'}],schemaTypes:['profile','post','project'],weakReferences:true,bulkPublish:false,apiVersion}),presentationTool({
 previewUrl:process.env.NEXT_PUBLIC_STATIC_PAGES==='true'?{origin:process.env.NEXT_PUBLIC_SANITY_PREVIEW_ORIGIN||'http://127.0.0.1:3000',initial:'/en',previewMode:{enable:'/api/draft-mode/enable',disable:'/api/draft-mode/disable'}}:{initial:'/en',previewMode:{enable:'/api/draft-mode/enable',disable:'/api/draft-mode/disable'}},
 resolve:{locations:{
 post:defineLocations({select:{title:'title',language:'language',slug:'slug.current'},resolve:doc=>({locations:doc?.slug?[{title:doc.title||'Blog post',href:`/${doc.language||'en'}/blog/${doc.slug}`},{title:'Blog',href:`/${doc.language||'en'}`}]:[]})}),
 profile:defineLocations({select:{language:'language'},resolve:doc=>({locations:[{title:'About / CV',href:`/${doc?.language||'en'}/about`}]})}),
 project:defineLocations({select:{language:'language'},resolve:doc=>({locations:[{title:'Portfolio',href:`/${doc?.language||'en'}/portfolio`}]})}),
 siteSettings:defineLocations({locations:[{title:'Blog',href:'/en'}]})
 }}
 })],schema:{types:schemaTypes},
 document:{newDocumentOptions:(prev)=>prev.filter(t=>!['siteSettings','profile'].includes(t.templateId)),actions:(prev,{schemaType})=>['siteSettings','profile'].includes(schemaType)?prev.filter(a=>!['duplicate'].includes(a.action||'')):prev},
});
