import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {existsSync,mkdirSync,writeFileSync,readdirSync} from 'node:fs';
import {homedir} from 'node:os';
import {join} from 'node:path';
import {catalogue} from '../src/lib/datasets';
import {getEntries} from '../src/lib/content';

const output=join(process.cwd(),'.check/data-sources');mkdirSync(output,{recursive:true});
const server=process.argv[2]?null:Bun.serve({hostname:'127.0.0.1',port:0,async fetch(req){let path=decodeURIComponent(new URL(req.url).pathname);if(path.endsWith('/'))path+='index.html';const f=Bun.file(join(process.cwd(),'site',path));return await f.exists()?new Response(f):new Response('Not found',{status:404})}});
const base=process.argv[2]||`http://127.0.0.1:${server!.port}`;
const cache=join(homedir(),'Library/Caches/ms-playwright');
const installed=readdirSync(cache).filter(n=>n.startsWith('chromium_headless_shell-')).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true}));
const executablePath=process.env.CHROMIUM||installed.map(n=>join(cache,n,'chrome-headless-shell-mac-arm64/chrome-headless-shell')).find(existsSync)||'';
assert(existsSync(executablePath),'chrome-headless-shell must be installed');
const browser=await chromium.launch({headless:true,executablePath});
const checks:string[]=[];
const pass=(text:string)=>{checks.push(text);console.log(`PASS ${text}`)};
try{
 const context=await browser.newContext({colorScheme:'light',reducedMotion:'reduce'});
 const page=await context.newPage();const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const visible=()=>page.locator('[data-source-record]:visible');
 const noOverflow=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal page overflow');
 for(const width of [950,1440,390]){
  await page.setViewportSize({width,height:width===390?844:900});
  assert.equal((await page.goto(base+'/data-sources/'))?.status(),200);
  await page.locator('[data-source-tools]').waitFor();assert.equal(await visible().count(),catalogue.length);await noOverflow();
  await page.screenshot({path:join(output,`sources-${width}.png`)});
  await page.locator('#source-query').fill('child language');assert.equal(await visible().count(),2);assert.match((await visible().allTextContents()).join(' '),/CHILDES/);assert(await page.locator('#talkbank').isVisible());
  await page.reload();assert.equal(await page.locator('#source-query').inputValue(),'child language');assert.equal(await visible().count(),2);
  await page.screenshot({path:join(output,`child-language-${width}.png`)});await page.locator('#childes .source-notes summary').click();await page.screenshot({path:join(output,`child-language-notes-${width}.png`)});await noOverflow();
  await page.getByRole('button',{name:'Clear filters',exact:true}).click();
  await page.locator('#source-query').fill('historical Great Britain');assert(await visible().count()>0,'notes-only search');
  await page.locator('#source-access').selectOption('paid');assert.equal(await visible().count(),0);await page.locator('[data-source-clear]').click();assert.equal(await visible().count(),catalogue.length);
  await page.locator('#source-access').selectOption('open');await page.locator('#source-use').selectOption('considered');
  assert.equal(await visible().count(),catalogue.filter(d=>d.access==='open'&&!d.snacks.length).length);
  await page.reload();assert.equal(await page.locator('#source-use').inputValue(),'considered');
  await page.locator('#source-sort').selectOption('title-desc');const sorted=await visible().evaluateAll(cards=>cards.map(c=>c.getAttribute('data-title')!));assert.deepEqual(sorted,[...sorted].sort((a,b)=>b.localeCompare(a,'en-GB',{numeric:true,sensitivity:'base'})));
  await page.goBack();assert.equal(await page.locator('#source-sort').inputValue(),'title');
  await page.goto(base+'/data-sources/?q=no-match&access=paid#talkbank');assert(await page.locator('#talkbank').isVisible());await noOverflow();
  await page.goto(base+'/data-sources/');await page.evaluate(()=>document.documentElement.style.fontSize='200%');await noOverflow();await page.screenshot({path:join(output,`sources-text-200-${width}.png`)});
  await page.goto(base+'/');await noOverflow();
  pass(`${width}px: search, notes, combined filters, empty/clear, sort, URL reload/Back, anchored record, 200% text and home navigation`);
 }
 await page.setViewportSize({width:950,height:900});
 for(const scheme of ['dark','forced'] as const){await page.emulateMedia(scheme==='dark'?{colorScheme:'dark'}:{forcedColors:'active'});await page.goto(base+'/data-sources/');await noOverflow();await page.screenshot({path:join(output,`sources-${scheme}-950.png`)})}
 await page.emulateMedia({colorScheme:'light',forcedColors:'none'});
 for(const entry of getEntries()){
  const expected=catalogue.filter(d=>d.snacks.some(s=>s.url===`https://researchsnacks.semanticmachines.fyi/${entry.id}/`));
  await page.goto(`${base}/${entry.id}/`);
  const links=page.locator('.making a[href^="/data-sources/#"]');assert.equal(await links.count(),expected.length);
  if(expected.length&&entry.id==='2026-11-17-can-a-cake-be-sickly'){
   await links.first().scrollIntoViewIfNeeded();await page.screenshot({path:join(output,'snack-appendix-950.png')});await links.first().click();assert(await page.locator(new URL(page.url()).hash).isVisible());
  }
 }
 pass('all snack appendix links match the catalogue; clicked appendix link reaches visible anchored record');
 await page.goto(base+'/data-sources/');
 for(const a of await page.locator('.source-usage a').all()){assert.match((await a.getAttribute('href'))!,/^\/\d{4}-\d{2}-\d{2}-[^/]+\/$/)}
 for(const file of ['datasets.csv','datasets.json','index.md'])assert.equal((await context.request.get(`${base}/data-sources/${file}`)).status(),200);
 pass('internal snack links and CSV/JSON/Markdown downloads');
 await page.locator('#source-query').focus();await page.keyboard.press('Tab');assert.equal(await page.locator('#source-access').evaluate(el=>el===document.activeElement),true);await page.keyboard.press('ControlOrMeta+k');assert(await page.locator('#search-dlg').evaluate((el:HTMLDialogElement)=>el.open));await page.keyboard.press('Escape');assert(await page.locator('#source-access').evaluate(el=>el===document.activeElement));pass('keyboard traversal, shared search opens, Escape closes and focus returns');
 const noJS=await browser.newContext({javaScriptEnabled:false});const plain=await noJS.newPage();
 for(const width of [950,1440,390]){await plain.setViewportSize({width,height:900});await plain.goto(base+'/data-sources/');assert.equal(await plain.locator('[data-source-record]:visible').count(),catalogue.length);assert.equal(await plain.locator('form:visible').count(),0);await plain.locator('#talkbank summary').click();assert(await plain.locator('#talkbank details').evaluate((el:HTMLDetailsElement)=>el.open));assert(await plain.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));if(width===950){await plain.goto(base+'/data-sources/');await plain.screenshot({path:join(output,'sources-no-js-950.png')})}}
 await noJS.close();pass(`no JavaScript: all ${catalogue.length} records, native notes, downloads and no overflow at all three widths`);
 const blocked=await browser.newContext();await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('storage blocked')}})});const safe=await blocked.newPage();await safe.goto(base+'/data-sources/');await safe.locator('#source-query').fill('Child Language Data Exchange System');assert.equal(await safe.locator('[data-source-record]:visible').count(),1);await blocked.close();pass('storage blocked: search still works');
 assert.deepEqual(errors,[]);pass('no page errors; dark and forced-colours captures');await context.close();
 writeFileSync(join(output,'results.json'),JSON.stringify({target:base,browser:executablePath,checks},null,2)+'\n');
}finally{await browser.close();server?.stop(true)}
