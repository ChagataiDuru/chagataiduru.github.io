// Temporary visual QA harness. Produces no CMS document or blog post.
import React from 'react';
import {readFile,writeFile} from 'node:fs/promises';
import {renderToStaticMarkup} from 'react-dom/server';
import {CodeBlock} from '../components/rich-text';
async function main(){
const code=renderToStaticMarkup(await CodeBlock({value:{_type:'code',_key:'qa',language:'typescript',filename:'layout-check.ts',code:'const başlık = "Türkçe karakter kontrolü";\nconsole.log(başlık);\n// Long code stays inside a scrollable block.\nconst example = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";'}}));
const css=await readFile('app/globals.css','utf8');
const html=`<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Temporary article layout verification</title><style>${css}</style><header class="site-header"><a class="site-name" href="/tr">Çağatay Duru</a><nav><a href="/tr">Blog</a><a href="/tr/about">Hakkımda</a><a href="/tr/portfolio">Portfolyo</a></nav></header><main class="article-layout"><aside class="author-sidebar"><img src="/portrait.jpeg" alt="Çağatay Duru" width="100" height="100"><div><h2>Çağatay Duru</h2><p>Software Engineer</p><a href="/tr/about">Hakkımda</a><div class="contact-links"><a href="https://github.com/ChagataiDuru">GitHub</a></div></div></aside><article class="article"><h1>Makale düzeni doğrulaması</h1><div class="meta">Yalnızca görsel test · Blog yazısı değildir</div><p class="excerpt">Türkçe karakterler: ç, ğ, ı, İ, ö, ş, ü.</p><div class="prose"><h2>Başlık, liste ve kod</h2><p>Bu geçici sayfa makale sütununu ve yazar kenar çubuğunu doğrular.</p><ul><li>Okunabilir metin sütunu</li><li>Mobilde üstte duran yazar bilgisi</li></ul><p><a href="/tr/about">Özgeçmiş bağlantısı</a></p>${code}<figure><img src="/portrait.jpeg" alt="İçe aktarılan portre" width="280"><figcaption>Resim ve açıklama kontrolü</figcaption></figure></div></article></main></html>`;
await writeFile('public/__layout-check.html',html);
}
main();
