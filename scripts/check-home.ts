import assert from 'node:assert/strict';
import type {Browser} from 'playwright-core';
import {getEntries,names} from '../src/lib/content';
import {getHomeData} from '../src/lib/home';
export async function checkHome(browser:Browser,base:string,shots?:string){
 const entries=getEntries(),expected=entries.map(x=>x.id);
 const items=getHomeData(entries).items;
 const inSubject=(subject:string)=>items.filter(x=>x.subject===subject).length;
 const context=await browser.newContext({colorScheme:'light',reducedMotion:'reduce'});
 const page=await context.newPage();const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const ids=()=>page.locator('[data-home-card]:visible').evaluateAll(es=>es.map(e=>e.getAttribute('data-entry-id')));
 try {
  for(const width of [950,1440,390]){
   await page.setViewportSize({width,height:width===390?844:800});await page.goto(base+'/');await page.locator('.home-enhanced').waitFor();
   assert.deepEqual(await ids(),expected,'All is complete, chronological and not duplicated');
   const sort=page.locator('[data-home-sort]');assert.equal(await sort.count(),1,'Home has an order selector');
   assert.equal(await page.locator('#home-list-title').innerText(),'All');assert.equal(await page.locator('[data-home-count]').innerText(),String(entries.length));
   await sort.selectOption('oldest');assert.equal((await ids())[0],'2026-11-16-one-in-270-jobs');
   assert.equal(new URL(page.url()).searchParams.get('sort'),'oldest');await page.reload();assert.equal((await ids())[0],'2026-11-16-one-in-270-jobs');if(shots&&width===950)await page.screenshot({path:`${shots}/preview-oldest-950.png`});
   await sort.selectOption('title');assert.equal((await ids())[0],'2026-11-17-can-a-cake-be-sickly');if(shots&&width===950)await page.screenshot({path:`${shots}/preview-title-950.png`});
   await page.goBack();assert.equal(await sort.inputValue(),'oldest');assert.equal((await ids())[0],'2026-11-16-one-in-270-jobs');
   await page.locator('[data-home-subject=economic-history]').click();assert.equal((await ids())[0],'2026-11-16-one-in-270-jobs');assert.equal((await ids()).length,inSubject('economic-history'));
   await page.locator('[data-home-subject=all]').click();assert.equal((await ids()).length,entries.length);assert.equal(await sort.inputValue(),'oldest');
   await sort.selectOption('newest');assert.deepEqual(await ids(),expected);

   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`home overflow at ${width}`);
   assert.equal(await page.locator('[data-home-topics]').evaluate((e:HTMLDetailsElement)=>e.open),width>=760);
   if(shots){await page.screenshot({path:`${shots}/preview-home-${width}.png`});if(width===950)await page.screenshot({path:`${shots}/preview-home-${width}-full.png`,fullPage:true});}
   if(width===390){await page.locator('[data-home-topics] summary').click();if(shots)await page.screenshot({path:`${shots}/preview-topics-390.png`});}
   assert.equal(await page.locator('[data-topic-tag]:visible').count(),new Set(entries.flatMap(x=>[...(x.category?[String(x.category)]:[]),...names(x.tags)])).size);
   await page.locator('[data-home-subject=economic-history]').click();assert.equal((await ids()).length,inSubject('economic-history'));
   assert(new URL(page.url()).searchParams.get('cat')==='economic-history');
   await page.locator('[data-home-subject=linguistics]').click();assert.equal((await ids()).length,inSubject('linguistics'));
   await page.goBack();assert.equal((await ids()).length,inSubject('economic-history'));
   await page.reload();assert.equal((await ids()).length,inSubject('economic-history'));if(shots&&width===950)await page.screenshot({path:`${shots}/preview-economic-history-950.png`});
   await page.locator('[data-home-subject=all]').click();assert.deepEqual(await ids(),expected);
   await page.locator('#home-search-input').fill('cake');await page.locator('#home-search-input').press('Enter');
   assert(await page.locator('#search-dlg').evaluate((d:HTMLDialogElement)=>d.open));assert.equal(await page.locator('#search-input').inputValue(),'cake');
   await page.waitForFunction(()=>document.querySelectorAll('#search-results [role=option]').length===1);
   assert((await page.locator('#search-results').innerText()).includes('Can a cake be sickly?'));if(shots&&width===950)await page.screenshot({path:`${shots}/preview-search-950.png`});
   await page.keyboard.press('Escape');assert(await page.locator('#home-search-input').evaluate(e=>e===document.activeElement));
   await page.locator('[data-home-search] button').click();await page.keyboard.press('Escape');assert(await page.locator('[data-home-search] button').evaluate(e=>e===document.activeElement));
   await page.locator('#home-search-input').fill('zzzznosuchsnack');await page.locator('#home-search-input').press('Enter');
   await page.waitForFunction(()=>document.querySelector('.search-status')?.textContent?.includes('No results'));
   await page.keyboard.press('Escape');
   await page.addStyleTag({content:'html{font-size:200%}'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`home overflow at 200% ${width}`);
  }
  await page.goto(base+'/?sort=invalid');assert.deepEqual(await ids(),expected);assert.equal(await page.locator('[data-home-sort]').inputValue(),'newest');
  await page.goto(base+'/?cat=unknown');assert.deepEqual(await ids(),expected,'Unknown subject falls back to All');
  if(!await page.locator('[data-home-topics]').evaluate((e:HTMLDetailsElement)=>e.open))await page.locator('[data-home-topics] summary').click();
  const tag=page.locator('[data-topic-tag="corpus-linguistics"]');await tag.click();assert.equal(await page.locator('.feed-entry').count(),3);await page.goBack();assert.deepEqual(await ids(),expected);
  assert.deepEqual(errors,[]);
 }finally{await context.close()}
 const nojs=await browser.newContext({javaScriptEnabled:false,colorScheme:'light'});const p=await nojs.newPage();
 try{
  for(const width of [950,390]){
   await p.setViewportSize({width,height:844});await p.goto(base+'/');assert.equal(await p.locator('[data-home-sort]:visible').count(),0);assert(await p.locator('[data-home-sort-fallback]').isVisible());assert.equal(await p.locator('[data-home-card]:visible').count(),entries.length);
   await p.locator('[data-home-subject=economic-history]').click();assert.equal(await p.locator('[data-home-card]:visible').count(),5);
   await p.locator('[data-home-subject=all]').click();assert.equal(await p.locator('[data-home-card]:visible').count(),entries.length);
   await p.locator('#home-search-input').fill('cake');await p.locator('[data-home-search] button').click();assert(new URL(p.url()).pathname==='/search/');assert.equal(new URL(p.url()).searchParams.get('q'),'cake');
  }
 }finally{await nojs.close()}
 console.log('PASS home: newest/oldest/title order, compact All/count, subjects/Back/reload, tag routes, shared search/query/focus, no results, no-JS links and 200% text at 950/1440/390.');
}
