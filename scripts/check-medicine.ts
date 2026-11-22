import {chromium} from 'playwright-core';
import {mkdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {homedir} from 'node:os';
import assert from 'node:assert/strict';
const root=join(import.meta.dir,'..');
const server=process.argv[2]?null:Bun.serve({hostname:'127.0.0.1',port:0,async fetch(req){let path=decodeURIComponent(new URL(req.url).pathname);if(path.endsWith('/'))path+='index.html';const file=Bun.file(join(root,'site',path));return await file.exists()?new Response(file):new Response('Not found',{status:404});}});
const base=process.argv[2]||`http://127.0.0.1:${server!.port}`;
const executablePath=process.env.CHROMIUM||join(homedir(),'Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell');
const browser=await chromium.launch({headless:true,...(existsSync(executablePath)?{executablePath}:{})});
const out=join(root,'.check/medicine');mkdirSync(out,{recursive:true});
const errors:string[]=[];
try{
 const page=await browser.newPage({viewport:{width:390,height:900},acceptDownloads:true});
 page.on('pageerror',e=>errors.push(e.message));
 for(const width of [390,728,1024,1400]){
  await page.setViewportSize({width,height:1000});
  assert.equal((await page.goto(base+'/2026-11-22-medicine-training-routes/'))?.status(),200);
  const frameEl=page.locator('iframe.tool-embed');await frameEl.scrollIntoViewIfNeeded();
  const tool=frameEl.contentFrame();await tool.locator('html.embedded').waitFor();
  assert.equal(await tool.locator('.route-row').count(),6);
  assert.equal(await tool.locator('#all-sources .source').count(),32);
  for(const clock of ['leaving','age18','school']){
   await tool.locator(`[name=clock][value=${clock}]`).check();
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`page overflow ${width}/${clock}`);
   assert(await tool.locator('.timeline-scroll').evaluate(el=>el.scrollWidth<=el.clientWidth+1),`timeline overflow ${width}/${clock}`);
   const content=await tool.locator('main').evaluate(el=>Math.ceil(el.getBoundingClientRect().height)+32);
   await page.waitForFunction(h=>document.querySelector('iframe')!.clientHeight>=h,content);
  }
  await tool.locator('[name=clock][value=leaving]').check();
  await tool.locator('[data-route=india] .milestone-label[data-stage=in-first]').click();
  assert((await tool.locator('#evidence').innerText()).includes('MBBS pass certificate'));
  const downloadPromise=page.waitForEvent('download');await tool.locator('#export').click();const download=await downloadPromise;
  const csv=await Bun.file((await download.path())!).text();assert(csv.includes('in-family-ready'));assert(csv.includes('source_passages'));
  await tool.locator('#specialties').uncheck();assert.equal(await tool.locator('.phase.specialty').count(),0);await tool.locator('#specialties').check();assert.equal(await tool.locator('.phase.specialty').count(),6);
  await page.locator('#registration-and-family-medicine-training').evaluate(el=>el.scrollIntoView());await page.screenshot({path:join(out,`milestones-${width}.png`)});
  await frameEl.screenshot({path:join(out,`timeline-${width}.png`)});
 }
 await page.getByRole('heading',{name:'Cite this page',exact:true}).evaluate(el=>el.scrollIntoView());
 await page.screenshot({path:join(out,'citations.png')});
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const p=await nojs.newPage();
 assert.equal((await p.goto(base+'/2026-11-22-medicine-training-routes/'))?.status(),200);
 assert((await p.locator('main').innerText()).includes('5½ to 9'));
 assert.equal((await p.goto(base+'/tools/medicine-training-routes/'))?.status(),200);
 assert.equal(await p.locator('.static-record').count(),55);
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({status:'PASS',widths:[390,728,1024,1400],clocks:3,routes:6,sources:32,stages:55,embeddedDownload:true,frameHeight:true,noPageOrTimelineOverflow:true,noJavaScript:true,consoleErrors:errors}));
}finally{await browser.close();server?.stop();}
