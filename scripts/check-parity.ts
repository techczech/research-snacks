import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseHTML } from 'linkedom';
import assert from 'node:assert/strict';
import { files, getEntries, ROOT } from '../src/lib/content';
const old=join(ROOT,'.check/old-site'), next=join(ROOT,'site');
assert(existsSync(old),'Build the Python baseline into .check/old-site first.');
const a=files(old).map(f=>relative(old,f)), b=files(next).map(f=>relative(next,f));
const removed=a.filter(f=>!b.includes(f)), added=b.filter(f=>!a.includes(f));
assert.deepEqual(removed,[],'Old public output paths disappeared');
const staticFiles=a.filter(f=>!['index.html','about/index.html','style.css','copy.js','_headers',...getEntries().map(x=>x.id+'/index.html')].includes(f));
for(const f of staticFiles)assert.deepEqual(readFileSync(join(old,f)),readFileSync(join(next,f)),f);
const normal=(el:any)=>el?.textContent.replace(/\s+/g,'').trim();
const results=[];
for(const path of ['index.html','about/index.html',...getEntries().map(x=>x.id+'/index.html')]){
 const before=parseHTML(readFileSync(join(old,path),'utf8')).document, after=parseHTML(readFileSync(join(next,path),'utf8')).document;
 const selectors=path==='index.html'?['.hero','.list']:path.startsWith('about/')?[]:['h1','.legend','.facts','.body-md','.refs','.assets','.cite','.making-intro'];
 for(const sel of selectors)assert.deepEqual([...after.querySelectorAll(sel)].map(normal),[...before.querySelectorAll(sel)].map(normal),`${path}: ${sel} text`);
 if(path.startsWith('about/')){const orig=normal(before.querySelector('.body-md'));assert(normal(after.querySelector('.body-md')).startsWith(orig),'About source changed');}
 const anchors=[...before.querySelectorAll('main h2[id],main h3[id]')].map((x:any)=>x.id);
 for(const id of anchors)assert(after.getElementById(id),`${path}: anchor #${id} lost`);
 const oldLinks=[...before.querySelectorAll('main a')].map((x:any)=>x.getAttribute('href'));
 const newLinks=[...after.querySelectorAll('main a')].map((x:any)=>x.getAttribute('href'));
 for(const href of oldLinks)assert(newLinks.includes(href),`${path}: link ${href} lost`);
 const meta=(doc:any)=>[...doc.querySelectorAll('meta[name^=citation_],meta[name^="DC."],meta[property^="og:"],meta[name^="twitter:"]')].map((x:any)=>[x.getAttribute('name') || x.getAttribute('property'),x.getAttribute('content')]);
 const newmeta=meta(after);for(const m of meta(before))assert(newmeta.some(n=>JSON.stringify(n)===JSON.stringify(m)),`${path}: metadata ${m} changed`);
 results.push(`${path}: existing content, links, anchors and metadata preserved`);
}
mkdirSync(join(ROOT,'.check'),{recursive:true});
writeFileSync(join(ROOT,'.check/parity.json'),JSON.stringify({oldFiles:a.length,newFiles:b.length,removed,added,unchangedAssets:staticFiles.length,pages:results},null,2));
console.log(`PASS: ${a.length} old paths retained; ${staticFiles.length} assets/exports byte-identical; ${results.length} pages preserve content, metadata, links and heading anchors. Added ${added.length} paths.`);
