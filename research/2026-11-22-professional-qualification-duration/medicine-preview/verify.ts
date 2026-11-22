import {chromium} from 'playwright-core';
import {join,dirname} from 'node:path';
import {homedir} from 'node:os';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const here=dirname(new URL(import.meta.url).pathname);
const browser=await chromium.launch({headless:true,executablePath:join(homedir(),'Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell')});
const page=await browser.newPage({viewport:{width:1280,height:1000}});
const failures:string[]=[];page.on('pageerror',e=>failures.push(e.message));
const network:string[]=[];page.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url());});
await page.goto('file://'+join(here,'medicine-timeline.html'));
await page.waitForTimeout(100);
assert.equal(await page.locator('.route-row').count(),6);
assert.equal(await page.locator('#chart .phase.specialty').count(),7);
// Same route shifts by school years, not another set of training sums.
const ca=page.locator('[data-route=california] .phase.degree');
const left0=await ca.evaluate(e=>parseFloat((e as HTMLElement).style.left));
await page.locator('[name=clock][value=age18]').check();
assert.equal(await ca.evaluate(e=>parseFloat((e as HTMLElement).style.left)),left0);
assert.equal(await page.locator('[data-route=bavaria] .phase.school').count(),1);
await page.locator('[name=clock][value=school]').check();
assert.equal(await page.locator('.phase.school').count(),6);
assert(Math.abs(await ca.evaluate(e=>parseFloat((e as HTMLElement).style.left))-16/26*100)<1e-4);
// A one-year licensing threshold is separate from residency completion.
await page.locator('[name=clock][value=leaving]').check();
await page.locator('[data-route=california] .milestone-label[data-stage=ca-full]').click();
await page.locator('#evidence details').first().locator('summary').click();
assert((await page.locator('#evidence').innerText()).includes('36 months'));
assert((await page.locator('#evidence').innerText()).includes('12 (United States'));
// Embedded German clinical year and Japan's role lane remain selectable.
await page.locator('[data-route=bavaria] summary').click();
await page.locator('[data-stage=de-pj]').click();
assert((await page.locator('#evidence').innerText()).includes('adds no time'));
await page.locator('[data-stage=jp-manager]').click();
assert((await page.locator('#evidence').innerText()).includes('1 April 2026'));
await page.locator('[name=clock][value=school]').check();
assert((await page.locator('#evidence').innerText()).includes('20 to 23 years'));
await page.locator('[name=clock][value=leaving]').check();
await page.locator('#specialties').uncheck();
assert.equal(await page.locator('#chart .phase.specialty,#chart .phase.later_role').count(),0);
assert.equal(await page.locator('#chart .phase.clinical').count(),6);
// Download parses as the same records and carries provenance.
const pending=page.waitForEvent('download');await page.locator('#export').click();const download=await pending;
const path=await download.path();const csv=readFileSync(path!,'utf8');
assert(csv.includes('source_passages'));assert(csv.includes('ca-family-ready'));assert(csv.includes('in-intern'));
const data=await page.locator('#payload').evaluate(e=>JSON.parse(e.textContent!));
assert.equal(data.routes.flatMap((r:any)=>r.stages).length,50);
const expected={california:108,england:72,bavaria:75,japan:72,india:66,singapore:72};
for(const [id,month] of Object.entries(expected))assert.equal(data.routes.find((r:any)=>r.id===id).stages.find((s:any)=>s.kind==='full_registration').start,month);
assert.equal(data.eu.length,32);assert.equal(data.gp.length,27);
for(const route of data.routes){const main=route.stages.filter((s:any)=>['prerequisite','degree','clinical','specialty'].includes(s.kind));for(let i=1;i<main.length;i++)assert.equal(main[i-1].end,main[i].start,route.id+' continuous main route');for(const s of route.stages)assert.deepEqual(Object.keys(s).filter(k=>k!=='short_label').sort(),['id','label','kind','start','end','duration_basis','sources','note'].sort());}
// No whole-page overflow at mobile width; the timeline owns its scroll.
await page.setViewportSize({width:390,height:844});
assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.locator('#theme').selectOption('dark');
assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
await page.emulateMedia({reducedMotion:'reduce',forcedColors:'active'});
assert.equal(await page.locator('.route-row').count(),6);
await page.emulateMedia({forcedColors:'none'});
await page.screenshot({path:join(here,'verification-mobile.png'),fullPage:true});
const nojs=await browser.newContext({javaScriptEnabled:false});const np=await nojs.newPage();await np.goto('file://'+join(here,'medicine-timeline.html'));
assert.equal(await np.locator('.route-row').count(),6);assert.equal(await np.locator('.static-record').count(),50);assert.equal(await np.locator('#all-sources .source').count(),26);
assert.equal(network.length,0);assert.deepEqual(failures,[]);
console.log(JSON.stringify({routes:6,stages:50,sources:26,eu_records:32,gp_rows:27,clock_modes:3,offline:true,mobile_page_overflow:false,download:true,no_js_records:true,console_errors:failures}));
await browser.close();
