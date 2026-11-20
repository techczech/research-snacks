import assert from 'node:assert/strict';
import type {Browser} from 'playwright-core';
import {getEntries} from '../src/lib/content';
export async function checkCompact(browser:Browser,base:string){
 const nojs=await browser.newContext({javaScriptEnabled:false});const p=await nojs.newPage();
 for(const width of [950,1440,390]){await p.setViewportSize({width,height:900});
  for(const x of getEntries())for(const suffix of ['', 'figures/']){const r=await p.goto(`${base}/${x.id}/${suffix}`);assert.equal(r?.status(),200);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${x.id}/${suffix} no-JS overflow at ${width}`);assert.equal(await p.locator('table').evaluateAll(ts=>ts.some(t=>getComputedStyle(t).fontSize!=='16px')),false,`${x.id} table font`);}
 }
 await nojs.close();
 const ctx=await browser.newContext({reducedMotion:'reduce'}),page=await ctx.newPage();
 await page.setViewportSize({width:950,height:800});await page.goto(base);
 assert.equal(await page.locator('.filters,.hero').count(),0);
 assert(await page.locator('.home-heading').evaluate(e=>e.getBoundingClientRect().height<=150));
 for(const [width,height,n] of [[950,800,2],[1440,900,3]]){await page.setViewportSize({width,height});assert(await page.locator('.feed-entry').nth(n-1).evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight),`${n} complete home entries at ${width}`);}
 await page.setViewportSize({width:950,height:800});await page.goto(base+'/2026-11-19-revolution-speed-2011-redo/');
 assert(await page.locator('.toc').isVisible());
 const small=page.locator('#table-1');
 assert(await small.locator('table').evaluate(t=>t.getBoundingClientRect().width<t.closest('main')!.getBoundingClientRect().width-30),'two-column table must not stretch');
 assert.equal(await small.locator('input').count(),0);
 const values=await small.locator('tbody tr').allTextContents();
 const sort=small.locator('thead th').nth(1).locator('button');await sort.focus();await page.keyboard.press('Enter');assert.equal(await small.locator('th').nth(1).getAttribute('aria-sort'),'ascending');
 await page.keyboard.press('Space');assert.equal(await small.locator('th').nth(1).getAttribute('aria-sort'),'descending');
 await page.keyboard.press('Enter');assert.deepEqual(await small.locator('tbody tr').allTextContents(),values);assert.equal(await small.locator('.table-source-order').isVisible(),false);
 assert.equal(await small.locator('.table-tools').isVisible(),false,'small fitting table has no tool row');
 const fullTable=page.locator('#table-4');
 const full=fullTable.getByRole('button',{name:'Full view',exact:true});await full.focus();await page.keyboard.press('Enter');assert(await fullTable.evaluate(e=>e.matches(':popover-open')));await page.keyboard.press('Escape');assert.equal(await fullTable.evaluate(e=>e.matches(':popover-open')),false);assert(await full.evaluate(e=>e===document.activeElement));
 for(const width of [950,390]){await page.setViewportSize({width,height:800});await page.goto(base+'/2026-11-19-decipherment-methods-and-agents/');
  assert.equal(await page.locator('.toc').isVisible(),width>=760);
  if(width<760)assert(await page.locator('.toc-m').evaluate(e=>e.previousElementSibling?.matches('.facts')));
  const table=page.locator('#table-2'),input=table.getByRole('searchbox',{name:'Filter rows'});
  await table.locator('.table-sort').first().focus();await page.keyboard.press('Enter');assert.equal(await table.locator('th').first().getAttribute('aria-sort'),'ascending');
  await input.focus();await page.keyboard.type('Young; Champollion');assert.equal(await table.locator('tbody tr:visible').count(),1);assert(await table.locator('mark').count());assert((await table.locator('.table-count').innerText()).includes('1 of 20'));
  await input.fill('not-a-real-script');assert(await table.getByText('No rows match.',{exact:false}).isVisible());await table.getByRole('button',{name:'Clear',exact:true}).focus();await page.keyboard.press('Enter');assert.equal(await table.locator('tbody tr:visible').count(),20);
  await table.getByRole('button',{name:'Source order',exact:true}).focus();await page.keyboard.press('Enter');assert((await table.locator('tbody tr').first().innerText()).includes('Egyptian'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  const escaped=await page.locator('#table-3 :is(th,td)').evaluateAll(cells=>cells.flatMap(cell=>{const bounds=cell.getBoundingClientRect(),style=getComputedStyle(cell),right=bounds.right-parseFloat(style.paddingRight)+1,left=bounds.left+parseFloat(style.paddingLeft)-1;const walker=document.createTreeWalker(cell,NodeFilter.SHOW_TEXT);const escaped:string[]=[];while(walker.nextNode()){if(!walker.currentNode.textContent?.trim())continue;const range=document.createRange();range.selectNodeContents(walker.currentNode);if([...range.getClientRects()].some(r=>r.width>0&&(r.right>right||r.left<left)))escaped.push(cell.textContent||'');}return escaped;}));
  assert.deepEqual(escaped,[],`coding text escapes its cell at ${width}`);
 }
 for(const theme of ['light','dark']){
  await page.emulateMedia({colorScheme:theme as 'light'|'dark'});
  await page.goto(base+'/2026-11-19-decipherment-methods-and-agents/');
  const contrast=await page.locator('#table-3 .count-cell').evaluateAll(cells=>{
   const canvas=document.createElement('canvas');canvas.width=1;canvas.height=1;const c=canvas.getContext('2d')!;
   const luminance=(color:string)=>{c.clearRect(0,0,1,1);c.fillStyle=color;c.fillRect(0,0,1,1);const rgb=[...c.getImageData(0,0,1,1).data].slice(0,3).map(v=>{const n=v/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
   return Math.min(...cells.map(cell=>{const style=getComputedStyle(cell),a=luminance(style.color),b=luminance(style.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);}));
  });assert(contrast>=4.5,`${theme} count-cell contrast ${contrast}`);
 }
 // Exercise column selection with a real eligible five-column table when present.
 let exercised=false;
 for(const x of getEntries()){
  await page.goto(`${base}/${x.id}/`);const buttons=page.getByRole('button',{name:'Columns',exact:true});
  if(!await buttons.count())continue;await buttons.first().focus();await page.keyboard.press('Enter');const chooser=page.locator('.table-columns:popover-open');assert(await chooser.isVisible());const box=chooser.locator('input:not(:disabled)').first();await box.focus();await page.keyboard.press('Space');assert.equal(await box.isChecked(),false);await page.keyboard.press('Space');assert(await box.isChecked());await page.keyboard.press('Escape');exercised=true;break;
 }
 assert(exercised,'a real column chooser must be covered');
 // Overflow cues and compact controls must follow the actual frame, including after resize.
 for(const x of getEntries()){
  await page.goto(`${base}/${x.id}/`);
  for(const width of [950,1440,390,950]){
   await page.setViewportSize({width,height:800});await page.waitForTimeout(75);
   const failures=await page.locator('.reader-table').evaluateAll(wrappers=>wrappers.flatMap(w=>{
    const frame=w.querySelector<HTMLElement>('.table-scroll')!,tools=w.querySelector<HTMLElement>('.table-tools')!,hint=w.querySelector<HTMLElement>('.table-hint')!;
    const wide=frame.scrollWidth>frame.clientWidth+1,rows=w.querySelectorAll('tbody tr').length;
    return [hint.hidden===wide?'incorrect overflow hint':null,tools.hidden!==(rows<8&&!wide)?'incorrect tool row':null,hint.parentElement!==tools?'hint outside tools':null,frame.scrollHeight>frame.clientHeight+1?'vertical table scroll':null].filter(Boolean).map(f=>`${w.id}: ${f}`);
   }));assert.deepEqual(failures,[],`${x.id} at ${width}`);
  }
 }
 await page.setViewportSize({width:950,height:800});await page.goto(base+'/2026-11-19-revolution-speed-2011-redo/');
 for(const id of ['table-4','table-5'])assert(await page.locator(`#${id} .table-scroll`).evaluate(e=>e.scrollWidth<=e.clientWidth+1),`${id} text and headers fit at 950px`);
 await page.goto(base+'/2026-11-19-hawks-and-doves/');
 assert(await page.locator('#table-1 .table-scroll').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'linked sources wrap and all four examples columns fit');
 assert.equal(await page.locator('#table-1 tbody tr').count(),7);
 const exampleLines=await page.locator('#table-1 tbody td').evaluateAll(cells=>cells.map(c=>{
  const walker=document.createTreeWalker(c,NodeFilter.SHOW_TEXT),ys=new Set<number>();
  while(walker.nextNode()){const node=walker.currentNode;for(let i=0;i<(node.textContent||'').length;i++){
   if(!node.textContent![i].trim())continue;const range=document.createRange();range.setStart(node,i);range.setEnd(node,i+1);ys.add(Math.round(range.getBoundingClientRect().top));
  }}return ys.size;
 }));
 const sourceLines=exampleLines.filter((_,i)=>i%4===1),judgementLines=exampleLines.filter((_,i)=>i%4===3);
 assert(sourceLines.every(n=>n<=3),`hawks sources are no longer squeezed: ${sourceLines}`);
 assert(judgementLines.every(n=>n<=4),`hawks judgements are no longer squeezed: ${judgementLines}`);
 assert.equal(await page.locator('colgroup[data-content-widths]').count(),0,'spare-width redistribution is removed');
 await page.goto(base+'/2026-11-19-decipherment-methods-and-agents/figures/');
 assert.equal(await page.locator('h1').innerText(),'Figures and tables');
 assert((await page.locator('.figure-index a').first().innerText()).startsWith('Table 1: '));
 assert(await page.locator('#table-1 .figure-back a[download]').count(),'small table CSV remains available in gallery');
 await ctx.close();console.log('PASS Compact table keyboard sort/filter/reset/columns/full-view, 950px sidebar, home density, all no-JS article/figures widths');
}
