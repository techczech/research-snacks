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
const out=join(root,'.check/comparison');mkdirSync(out,{recursive:true});
const errors:string[]=[];
try{
 const page=await browser.newPage({viewport:{width:390,height:900},acceptDownloads:true});page.on('pageerror',e=>errors.push(e.message));
 for(const width of [390,728,1024,1400]){
  await page.setViewportSize({width,height:1000});assert.equal((await page.goto(base+'/2026-11-22-medicine-training-routes/'))?.status(),200);
  const frameEl=page.locator('iframe.tool-embed');await frameEl.scrollIntoViewIfNeeded();const tool=frameEl.contentFrame();await tool.locator('html.embedded').waitFor();
  assert.equal(await tool.locator('.static-record').count(),55);assert.equal(await tool.locator('.school-record').count(),6);assert.equal(await tool.locator('.route-context details').count(),6);assert.equal(await tool.locator('#all-sources .source').count(),32);
  const model=await tool.locator('#payload').evaluate(el=>JSON.parse(el.textContent!));
  for(const view of ['routes','milestones']){
   await tool.locator(`[name=view][value=${view}]`).check();
   for(const clock of ['leaving','age18','school']){
    await tool.locator(`[name=clock][value=${clock}]`).check();assert.equal(await tool.locator('.route-row').count(),6);assert.equal(await tool.locator('.axis').count(),1);assert.equal(await tool.locator('.row-axis,.phases-list,.milestone-label').count(),0);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`page overflow ${width}/${view}/${clock}`);
    assert(await tool.locator('.comparison-scroll').evaluate(el=>el.scrollWidth<=el.clientWidth+1),`chart overflow ${width}/${view}/${clock}`);
    // All six tracks use the same physical origin and scale; every point is exact.
    const geometry=await tool.locator('.route-row').evaluateAll(rows=>rows.map(row=>{const track=row.querySelector('.route-track')!.getBoundingClientRect();return {id:row.getAttribute('data-route'),left:track.left,width:track.width,marks:[...row.querySelectorAll<HTMLElement>('.marker')].map(m=>({id:m.dataset.stage,year:+m.dataset.year!,center:m.getBoundingClientRect().left+m.getBoundingClientRect().width/2}))};}));
    const max=clock==='school'?26:clock==='age18'?13:12;
    for(const row of geometry){assert(Math.abs(row.left-geometry[0].left)<1);assert(Math.abs(row.width-geometry[0].width)<1);for(const mark of row.marks)assert(Math.abs(mark.center-(row.left+mark.year/max*row.width))<1,`${row.id}/${mark.id} position`);}
    await tool.locator('#specialties').uncheck();assert.equal(await tool.locator('.phase.specialty').count(),0);
    for(const ids of Object.values(model.visual.milestones) as string[][])assert.equal(await tool.locator(`[data-stage="${ids[2]}"]`).count(),0);
    await tool.locator('#specialties').check();assert.equal(await tool.locator('.phase.specialty').count(),view==='routes'?6:0);
   }
   if(view==='routes'){
    await tool.locator('[name=clock][value=age18]').check();const school=tool.locator('[data-stage=bavaria-school]');await school.click();assert((await tool.locator('#stage-popover').innerText()).includes('0–1 years'));await tool.locator('#stage-popover .full-record').click();assert(await tool.locator('#bavaria-school').evaluate(el=>el===document.activeElement));await tool.locator('#all-records').evaluate((el:HTMLDetailsElement)=>el.open=false);await frameEl.scrollIntoViewIfNeeded();
    await tool.locator('[name=clock][value=school]').check();await tool.locator('[data-stage=california-school]').click();assert((await tool.locator('#stage-popover').innerText()).includes('0–12 years'));await tool.locator('#stage-popover .full-record').click();assert(await tool.locator('#california-school').evaluate(el=>el===document.activeElement));await tool.locator('#all-records').evaluate((el:HTMLDetailsElement)=>el.open=false);await frameEl.scrollIntoViewIfNeeded();
   }
   await tool.locator('[name=clock][value=leaving]').check();
   await tool.locator('.comparison-scroll').evaluate(el=>el.scrollTop=0);
   await tool.locator('.comparison-scroll').screenshot({path:join(out,`${view}-${width}.png`)});
   await tool.locator('.comparison-scroll').evaluate(el=>el.scrollTop=el.scrollHeight);
   await tool.locator('.comparison-scroll').screenshot({path:join(out,`${view}-bottom-${width}.png`)});
  }
  await tool.locator('[name=view][value=routes]').check();await tool.locator('.comparison-scroll').evaluate(el=>el.scrollTop=0);
  // Mouse hover and keyboard focus expose the same data; pinned details have a close action.
  const target=tool.locator('[data-route=california] .marker[data-stage=ca-first]');await target.hover();
  const pop=tool.locator('#stage-popover');await pop.waitFor({state:'visible'});assert((await pop.innerText()).includes('8–8 years'));assert((await pop.innerText()).includes('residency training'));
  await page.keyboard.press('Escape');assert(await pop.isHidden());await target.focus();await pop.waitFor({state:'visible'});
  await page.keyboard.press('Enter');assert(await pop.locator('.popover-close').evaluate(el=>el===document.activeElement));
  await page.keyboard.press('Tab');assert(await pop.locator('a[target=_blank]').first().evaluate(el=>el===document.activeElement));
  await page.keyboard.press('Escape');assert(await pop.isHidden());assert(await target.evaluate(el=>el===document.activeElement));
  await page.keyboard.press(' ');await pop.locator('.popover-close').click();assert(await pop.isHidden());
  // The axis remains fixed within the inner scrolling chart.
  const before=await tool.locator('.axis').boundingBox();await tool.locator('.comparison-scroll').evaluate(el=>el.scrollTop=250);const after=await tool.locator('.axis').boundingBox();assert(Math.abs(before!.y-after!.y)<1);
  await tool.locator('.comparison-scroll').evaluate(el=>el.scrollTop=0);
  // Host scrolling must keep the shared axis below the site's own sticky header.
  await page.evaluate(()=>scrollBy(0,600));await page.waitForTimeout(60);
  const axis=await tool.locator('.axis').boundingBox();const frameBox=await frameEl.boundingBox();const headerBottom=await page.locator('header.site').evaluate(el=>el.getBoundingClientRect().bottom);assert(axis!.y>=headerBottom-1&&frameBox!.y<200,'axis stays below host header');
  await frameEl.scrollIntoViewIfNeeded();
  await tool.locator('.tools details').evaluate((el:HTMLDetailsElement)=>el.open=true);
  const downloadPromise=page.waitForEvent('download');await tool.locator('#export').click();const download=await downloadPromise;const csv=await Bun.file((await download.path())!).text();assert(csv.includes('in-family-ready'));assert(csv.includes('source_passages'));
  await tool.locator('.tools details').evaluate((el:HTMLDetailsElement)=>el.open=false);
 }
 // Actual touch input in the opaque-origin iframe; no mouse hover prerequisite.
 const touch=await browser.newContext({hasTouch:true,isMobile:true,viewport:{width:390,height:844}});const t=await touch.newPage();await t.goto(base+'/2026-11-22-medicine-training-routes/');
 const frame=t.locator('iframe.tool-embed');await frame.scrollIntoViewIfNeeded();const tool=frame.contentFrame();await tool.locator('html.embedded').waitFor();
 const md=tool.locator('[data-stage=ca-md]');await md.tap();const pop=tool.locator('#stage-popover');await pop.waitFor({state:'visible'});assert((await pop.innerText()).includes('4–8 years'));assert(await pop.locator('a[target=_blank]').count()>0);
 const rect=await pop.boundingBox();assert(rect!.x>=0&&rect!.x+rect!.width<=390);assert(rect!.y>=0&&rect!.y+rect!.height<=844,'touch popup fits host viewport');
 await t.screenshot({path:join(out,'touch-popover-390.png')});
 await pop.locator('.popover-close').tap();assert(await pop.isHidden());await md.tap();await pop.locator('.full-record').tap();assert(await tool.locator('#all-records').evaluate((el:HTMLDetailsElement)=>el.open));assert(await tool.locator('#ca-md').evaluate(el=>el===document.activeElement));await touch.close();
 // Light/dark and forced-colour states keep labels and shapes, with no dependency on hover.
 for(const theme of ['light','dark']){
  await page.goto(base+'/tools/medicine-training-routes/');await page.selectOption('#theme',theme);await page.locator('[data-stage=ca-md]').focus();
  const colours=await page.locator('.phase').evaluateAll(es=>es.map(el=>({fg:getComputedStyle(el).color,bg:getComputedStyle(el).backgroundColor})));
  const lum=(rgb:string)=>{const values=rgb.match(/[\d.]+/g)!.slice(0,3).map(Number).map(n=>{const c=n/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;});return values[0]*.2126+values[1]*.7152+values[2]*.0722;};
  for(const pair of colours){const [low,high]=[lum(pair.fg),lum(pair.bg)].sort((a,b)=>a-b);assert((high+.05)/(low+.05)>=4.5,`${theme} bar text contrast`);}
  await page.screenshot({path:join(out,`${theme}-popover.png`)});
 }
 // Native-popover absence uses the same keyboard-accessible fixed-panel fallback.
 const fallback=await browser.newContext();await fallback.addInitScript(()=>Object.defineProperty(HTMLElement.prototype,'showPopover',{configurable:true,value:undefined}));const fp=await fallback.newPage();await fp.goto(base+'/tools/medicine-training-routes/');await fp.locator('[data-stage=ca-md]').click();assert(await fp.locator('#stage-popover').isVisible());await fp.keyboard.press('Escape');assert(await fp.locator('#stage-popover').isHidden());await fallback.close();
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const p=await nojs.newPage();await p.goto(base+'/tools/medicine-training-routes/');assert.equal(await p.locator('.route-row').count(),6);await p.locator('#all-records > summary').click();assert.equal(await p.locator('.static-record:visible').count(),55);assert.equal(await p.locator('#all-sources .source:visible').count(),32);
 assert.deepEqual(errors,[]);console.log(JSON.stringify({status:'PASS',widths:[390,728,1024,1400],clocks:3,views:2,routes:6,stages:55,sources:32,sharedScale:true,noOrphanMarkers:true,hover:true,keyboard:true,touch:true,popupInHostViewport:true,stickyAxis:true,download:true,noJavaScript:true,consoleErrors:errors}));
}finally{await browser.close();server?.stop();}
