import { chromium } from 'playwright-core';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { homedir } from 'node:os';
import assert from 'node:assert/strict';
import { getEntries, ROOT } from '../src/lib/content';
import { inspectEntryCharts } from './check-charts';
import {checkCompact} from './check-compact';
import {checkHome} from './check-home';
const dir=join(ROOT,'.check/release');mkdirSync(dir,{recursive:true});
const servers:any[]=[];
function serve(root:string){const s=Bun.serve({hostname:'127.0.0.1',port:0,async fetch(req){let p=decodeURIComponent(new URL(req.url).pathname);if(p.endsWith('/'))p+='index.html';const f=Bun.file(join(root,p));return await f.exists()?new Response(f):new Response('Not found',{status:404});}});servers.push(s);return `http://127.0.0.1:${s.port}`;}
const current=process.argv[2] || serve(join(ROOT,'site'));
const baseline=existsSync(join(ROOT,'.check/old-site/index.html'))?serve(join(ROOT,'.check/old-site')):undefined;
const executablePath=join(homedir(),'Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell');
const browser=await chromium.launch({headless:true,...(existsSync(executablePath)?{executablePath}:{})});
const records:Record<string,any>={target:current,checks:[],comparisons:[]};
const passed=(name:string,detail:any=true)=>{records.checks.push({name,passed:true,detail});console.log(`PASS ${name}`);};
const paths=['/','/about/',...getEntries().map(x=>`/${x.id}/`)];
const label=(path:string)=>path==='/'?'home':path.split('/').filter(Boolean)[0];
try {
  await checkCompact(browser,current);
  await checkHome(browser,current);
  records.charts = await inspectEntryCharts(browser,current,getEntries().map(entry=>`/${entry.id}/`));
  const chartFailures = records.charts.filter((result:any)=>result.errors.length);
  assert.deepEqual(chartFailures,[],`Vega-Lite chart failures: ${JSON.stringify(chartFailures,null,2)}`);
  passed('Every entry at desktop/phone widths: Vega-Lite renders without errors, draws data marks and has no undefined labels',records.charts);
  // Capture all six original routes at desktop and phone widths, with JS off so the same PNGs are compared.
  const nojs=await browser.newContext({javaScriptEnabled:false,colorScheme:'light'});
  const p=await nojs.newPage();
  for(const width of [1280,390]){
    await p.setViewportSize({width,height:900});
    for(const path of paths){
      for(const [kind,base] of [['new',current],['old',baseline]] as const){
        if(!base)continue;
        const response=await p.goto(base+path);assert.equal(response?.status(),200);
        await p.locator('main').first().waitFor();
        await p.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.all(Array.from(document.images).map(img=>img.complete?Promise.resolve():new Promise(r=>{img.onload=r;img.onerror=r;})));assertImages();function assertImages(){if(Array.from(document.images).some(i=>!i.naturalWidth))throw new Error('Broken image');}});
        assert(await p.locator('main').innerText());
        assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${kind} ${path} overflow at ${width}`);
        await p.screenshot({path:join(dir,`${kind}-${label(path)}-${width}.png`),fullPage:true});
      }
      records.comparisons.push({path,width,old:!!baseline,new:true});
    }
  }
  await nojs.close();passed('JavaScript off: six routes render, all PNGs load; no page overflow on desktop/phone');
  const jumping=await browser.newContext({reducedMotion:'no-preference'});const jump=await jumping.newPage();
  await jump.goto(current+'/2026-11-19-decipherment-methods-and-agents/');
  assert.equal(await jump.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
  await jump.locator('.toc a[href="#how-this-was-made"]').click();
  await jump.waitForFunction(()=>document.querySelector('.toc a[href="#how-this-was-made"]')?.getAttribute('aria-current')==='location');
  assert(await jump.locator('#how-this-was-made').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<250));
  await jumping.close();passed('Long-page contents jump immediately with motion enabled; section highlighting follows the jump');
  const ctx=await browser.newContext({colorScheme:'light',reducedMotion:'reduce'});const page=await ctx.newPage();const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(current);await page.locator('.js').waitFor();
  // keyboard open/containment/Esc/focus return for both dialogs.
  for(const [opener,dialog] of [['[data-open-search]','#search-dlg'],['[data-open-keys]','#keys-dlg']]){
    await page.locator(opener).focus();await page.keyboard.press('Enter');assert(await page.locator(dialog).evaluate((d:any)=>d.open));
    for(let i=0;i<14;i++){await page.keyboard.press('Tab');assert(await page.locator(dialog).evaluate(d=>d.contains(document.activeElement)||document.activeElement===document.body),`${dialog} focus escaped to ${await page.evaluate(()=>document.activeElement?.outerHTML.slice(0,200))}`);}
    await page.keyboard.press('Escape');assert.equal(await page.locator(dialog).evaluate((d:any)=>d.open),false);assert(await page.locator(opener).evaluate(el=>el===document.activeElement));
  }
  passed('Native search/keys dialogs: keyboard opening, Tab never reaches background controls, Esc, focus return');
  await page.locator('[data-open-keys]').click();await page.locator('[data-single-keys]').uncheck();await page.keyboard.press('Escape');
  await page.keyboard.press('/');await page.keyboard.press('?');await page.keyboard.press('m');assert.equal(await page.locator('dialog[open]').count(),0);assert.equal(await page.locator('html').getAttribute('data-theme'),null);
  await page.keyboard.press('Control+k');assert(await page.locator('#search-dlg').evaluate((d:any)=>d.open));await page.keyboard.press('Escape');
  await page.locator('[data-open-keys]').click();await page.locator('[data-single-keys]').check();await page.keyboard.press('Escape');passed('Single-key off switch stops /, ?, m; Ctrl+K still works');
  await page.keyboard.press('/');await page.locator('#search-input').fill('cake');await page.waitForFunction(()=>document.querySelectorAll('#search-results [role=option]').length===1);assert((await page.locator('#search-results').innerText()).includes('Can a cake be sickly?'));await page.keyboard.press('ArrowDown');assert(await page.locator('#search-input').getAttribute('aria-activedescendant'));await page.keyboard.press('Escape');
  passed('Build-time search returns grouped results with combobox selection');
  await page.getByRole('navigation',{name:'Categories',exact:true}).getByRole('link',{name:/Linguistics/}).click();
  assert.equal(await page.locator('.feed-entry:visible').count(),getEntries().filter(x=>x.category==='linguistics').length);
  await page.goBack();assert.equal(await page.locator('.feed-entry:visible').count(),getEntries().length);
  await page.goto(current+'/tags/linguistics/');assert.equal(await page.locator('.feed-entry').count(),getEntries().filter(x=>x.category==='linguistics').length);
  await page.goBack();assert.equal(await page.locator('.feed-entry').count(),getEntries().length);passed('Home subject filters, legacy category pages and Back preserve collection access');
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');await page.locator('[data-open-keys]').click();assert.equal(await page.locator('#keys-dlg').evaluate(d=>getComputedStyle(d).animationName),'none');await page.keyboard.press('Escape');
  await page.locator('[data-open-keys]').click();assert.equal(await page.locator('#keys-dlg').evaluate(el=>getComputedStyle(el).animationName),'none');await page.keyboard.press('Escape');passed('Reduced motion: instant scrolling and no dialog animation');
  await page.goto(current+'/2026-11-17-can-a-cake-be-sickly/');
  const kwic=page.locator('#sickly-kwic');assert.equal(await kwic.locator('tbody tr').count(),39);
  await kwic.locator('input[type=search]').fill('sole');let count=await kwic.locator('tbody tr:visible').count();assert(count>0&&count<39);
  await kwic.locator('input[type=search]').fill('');await kwic.locator('select').selectOption('OANC');assert.equal(await kwic.locator('tbody tr:visible').count(),6);
  await kwic.locator('[data-sort="0"]').click();assert.equal(await kwic.locator('th').first().getAttribute('aria-sort'),'ascending');
  const download=page.waitForEvent('download');await kwic.locator('#sickly-export').click();const saved=await download;await saved.saveAs(join(dir,'sickly-filtered.csv'));const csv=readFileSync(join(dir,'sickly-filtered.csv'),'utf8');assert.equal(csv.trim().split('\n').length,7);assert(csv.includes('OANC'));passed('Stand-off locators: 39 rows, search, corpus filter, sorting and six-row CSV export');
  await page.locator('#how-this-was-made').scrollIntoViewIfNeeded();await page.waitForFunction(()=>!!document.querySelector('.toc [aria-current="location"]'));assert.equal(await page.locator('.toc [aria-current="location"]').count(),1);assert.equal(await page.locator('.toc li.h2.open').count(),1);passed('TOC observer marks current heading and opens its H3 group');
  // Copy: API success, API rejection + legacy success, total failure visible.
  for(const mode of ['success','fallback','failure']){
    await page.evaluate(mode=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{if(mode!=='success')throw new Error('blocked');}}});document.execCommand=()=>mode==='fallback';},mode);
    await page.locator('[data-copy]').click();assert.equal(await page.locator('[data-copy]').innerText(),mode==='failure'?'Copy failed':'Copied');
    if(mode==='failure')assert((await page.locator('#toast').innerText()).includes('select the text'));
    await page.waitForFunction(()=>!document.querySelector('[data-copy]')?.hasAttribute('data-copy-state'));
  }
  passed('Copy: Clipboard API, execCommand fallback and visible failure');
  assert.deepEqual(errors,[]);await ctx.close();
  for(const scheme of ['dark','forced']){
    const c=await browser.newContext({colorScheme:'dark',forcedColors:scheme==='forced'?'active':'none'});const q=await c.newPage();
    for(const path of ['/','/2026-11-17-can-a-cake-be-sickly/']){await q.goto(current+path);await q.screenshot({path:join(dir,`${scheme}-${label(path)}.png`),fullPage:true});}
    await q.goto(current);await q.locator('[data-theme-set=light]').click();assert.equal(await q.locator('html').getAttribute('data-theme'),'light');if(scheme==='dark')assert.equal(await q.evaluate(()=>getComputedStyle(document.body).backgroundColor),'rgb(251, 250, 247)');await c.close();
  }
  passed('Dark and forced-colours screenshots; explicit light overrides dark system');
  const enlarged=await browser.newContext({reducedMotion:'reduce'});const large=await enlarged.newPage();
  for(const width of [1280,390]){await large.setViewportSize({width,height:900});for(const path of paths){await large.goto(current+path);const normal=await large.evaluate(()=>parseFloat(getComputedStyle(document.body).fontSize));await large.addStyleTag({content:'html{font-size:200%}'});const doubled=await large.evaluate(()=>parseFloat(getComputedStyle(document.body).fontSize));assert.equal(doubled,normal*2);assert.equal(await large.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${path} overflows with 200% text at ${width}`);}}
  await large.screenshot({path:join(dir,'text-200-percent-phone.png'),fullPage:true});await enlarged.close();passed('200% browser text: body doubles on six routes; no page overflow at desktop/phone widths');
  const blocked=await browser.newContext();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage blocked');}}));const b=await blocked.newPage();await b.goto(current);await b.locator('[data-theme-set=dark]').click();assert.equal(await b.locator('html').getAttribute('data-theme'),'dark');await b.locator('[data-open-keys]').click();await b.locator('[data-single-keys]').uncheck();await b.keyboard.press('Escape');await b.keyboard.press('/');assert.equal(await b.locator('dialog[open]').count(),0);await b.keyboard.press('Control+k');assert(await b.locator('#search-dlg').evaluate((d:any)=>d.open));await blocked.close();passed('Throwing storage: theme, page, shortcut off switch and Ctrl+K work');
  const offline=await browser.newContext();await offline.route('https://cdn.jsdelivr.net/**',r=>r.abort());const f=await offline.newPage();await f.goto(current+'/2026-11-16-one-in-270-jobs/');const fallback=f.locator('figure.ichart .fallback').first();await fallback.scrollIntoViewIfNeeded();await fallback.waitFor({state:'visible'});await f.waitForFunction(()=>{const img=document.querySelector<HTMLImageElement>('figure.ichart .fallback');return img?.complete && img.naturalWidth>0;});assert(await fallback.isVisible());assert.equal(await f.locator('figure.ichart.live').count(),0);await offline.close();passed('Chart CDN failure retains PNG fallback');
  records.passed=true;
} catch(error) {records.passed=false;records.error=String(error);throw error;}
finally{writeFileSync(join(dir,'release.json'),JSON.stringify(records,null,2));await browser.close();for(const s of servers)s.stop(true);}
