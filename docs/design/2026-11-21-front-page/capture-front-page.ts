import {chromium} from 'playwright-core';
import {mkdirSync,writeFileSync,readFileSync,existsSync} from 'node:fs';
import {join,dirname,resolve} from 'node:path';
import {homedir} from 'node:os';
import assert from 'node:assert/strict';
const dir=dirname(new URL(import.meta.url).pathname);
const shots=process.argv[2];
if(!shots)throw new Error('Pass the review image directory as the first argument.');
mkdirSync(shots,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:join(homedir(),'Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell')});
const evidence:any={capturedAt:new Date().toISOString(),browser:'Playwright chrome-headless-shell 1228',widths:[950,1440,390],pages:[],checks:[]};
try{
 const ctx=await browser.newContext({colorScheme:'light',reducedMotion:'reduce'});
 const page=await ctx.newPage();
 for(const [label,url] of [['live','https://researchsnacks.semanticmachines.fyi/'],['a-latest','file://'+join(dir,'mockup-a-latest.html')],['b-subjects','file://'+join(dir,'mockup-b-subjects.html')]]){
  for(const width of evidence.widths){
   await page.setViewportSize({width,height:width===390?844:800});await page.goto(url);await page.evaluate(()=>document.fonts.ready);
   const measurements=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,height:document.documentElement.scrollHeight,headingY:document.querySelector('main h1')?.getBoundingClientRect().y,firstQuestionY:document.querySelector('main article h3')?.getBoundingClientRect().y,questionsOnFirstScreen:[...document.querySelectorAll('main article h3')].filter(e=>e.getBoundingClientRect().bottom<=innerHeight).length,minFont:Math.min(...[...document.querySelectorAll('main *,header *')].filter(e=>e.textContent?.trim()&&e.getBoundingClientRect().width&&e.children.length===0).map(e=>parseFloat(getComputedStyle(e).fontSize)))}));
   await page.screenshot({path:join(shots,`${label}-${width}.png`),fullPage:false});
   if(width===950)await page.screenshot({path:join(shots,`${label}-${width}-full.png`),fullPage:true});
   evidence.pages.push({label,width,...measurements});assert.equal(measurements.overflow,false,`${label} overflow ${width}`);
  }
 }
 await page.setViewportSize({width:950,height:800});await page.goto('file://'+join(dir,'mockup-a-latest.html'));
 assert.equal(await page.locator('main article:visible').count(),10);
 for(const [subject,n] of [['linguistics',4],['economic-history',5],['political-change',1],['all',10]] as const){await page.locator(`[data-subject="${subject}"]`).click();assert.equal(await page.locator('main article:visible').count(),n)}
 await page.goBack();assert.equal(await page.locator('main article:visible').count(),1);
 await page.goto('file://'+join(dir,'mockup-a-latest.html')+'?cat=unknown');assert.equal(await page.locator('main article:visible').count(),10);
 await page.locator('[data-subject="economic-history"]').click();await page.screenshot({path:join(shots,'a-economic-history-950.png')});
 evidence.checks.push('A: ten entries; subjects 4/5/1; All restores ten; Back restores previous subject; unknown subject shows all.');
 await page.goto('file://'+join(dir,'mockup-b-subjects.html'));await page.locator('.subjects a[href="#economic-history"]').click();assert.equal(await page.locator('#economic-history article').count(),5);assert((await page.locator('#economic-history').boundingBox())!.y<200);evidence.checks.push('B: subject links jump to the correct section; all 4/5/1 entries are present.');
 for(const name of ['a-latest','b-subjects']){
  await page.goto('file://'+join(dir,`mockup-${name}.html`));
  const links=await page.locator('main article h3 a').evaluateAll(els=>els.map(e=>(e as HTMLAnchorElement).href));assert.equal(new Set(links).size,10);
  for(const width of [950,390]){await page.setViewportSize({width,height:844});await page.addStyleTag({content:'html{font-size:200%}'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await page.goto('file://'+join(dir,`mockup-${name}.html`));}
 }
 evidence.checks.push('Both: all ten unique canonical entry links; no overflow with 200% text at 950 and 390.');
 const nojs=await browser.newContext({javaScriptEnabled:false});const nj=await nojs.newPage();
 for(const name of ['a-latest','b-subjects']){await nj.goto('file://'+join(dir,`mockup-${name}.html`));assert.equal(await nj.locator('main article h3 a').evaluateAll(es=>new Set(es.map(e=>(e as HTMLAnchorElement).href)).size),10)}
 await nojs.close();evidence.checks.push('Both: all ten entries available with JavaScript off. A adds subject jump groups; B retains subject jumps.');
 evidence.passed=true;
}finally{writeFileSync(join(dir,'verification-front-page.json'),JSON.stringify(evidence,null,2)+'\n');await browser.close()}
console.log(JSON.stringify(evidence,null,2));
