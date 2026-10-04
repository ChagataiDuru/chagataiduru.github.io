import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const origin=process.env.CATOSITE_CHECK_ORIGIN || 'http://127.0.0.1:3000';
for(const lang of ['en','tr']) {
 for(const suffix of ['', '/about','/portfolio']) {
  const r=await fetch(`${origin}/${lang}${suffix}`);const body=await r.text();assert.equal(r.status,200);
  assert.ok(body.includes(`<html lang="${lang}">`));
  assert.ok(body.includes('Çağatay Duru'));assert.ok(body.includes('Sanity'));
  if(suffix==='/portfolio')assert.equal((body.match(/class="project-row"/g)||[]).length,7);
  if(!suffix)assert.ok(body.includes(lang==='tr'?'Henüz yazı yok.':'No posts yet.'));
  assert.ok(body.includes(`rel="canonical" href="http://localhost:3000/${lang}${suffix}"`));
  console.log('PASS',`/${lang}${suffix}`,'language/content/canonical');
 }
 const r=await fetch(`${origin}/${lang}/blog/unknown-slug`);assert.equal(r.status,404);console.log('PASS',`/${lang}/blog/unknown-slug`,404);
}
const redirect=await fetch(origin,{redirect:'manual'});assert.equal(redirect.status,307);assert.equal(redirect.headers.get('location'),'/en');console.log('PASS root redirect');
const pdf=await fetch(`${origin}/CagatayDuruCV.pdf`);assert.equal(pdf.status,200);assert.match(pdf.headers.get('content-type'),/pdf/);assert.deepEqual(Buffer.from(await pdf.arrayBuffer()),await readFile('public/CagatayDuruCV.pdf'));console.log('PASS CV download bytes');
const admin=await fetch(`${origin}/admin`);assert.equal(admin.status,200);const adminBody=await admin.text();assert.ok(adminBody.includes('publishing are not available yet'));console.log('PASS admin explicitly unconfigured');
const preview=await fetch(`${origin}/api/draft-mode/enable?sanity-preview-secret=forged`);assert.equal(preview.status,503);assert.equal(preview.headers.get('set-cookie'),null);console.log('PASS unauthenticated preview cannot set draft cookie');
const spoof=await fetch(`${origin}/tr/about`,{headers:{'x-site-locale':'en',cookie:'__prerender_bypass=forged; sanity-preview-perspective=drafts'}});assert.equal(spoof.status,200);assert.ok((await spoof.text()).includes('<html lang="tr">'));console.log('PASS spoofed locale/preview headers');
const invalid=await fetch(`${origin}/de`);assert.equal(invalid.status,404);console.log('PASS unsupported locale 404');
