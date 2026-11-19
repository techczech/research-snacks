import {isNumericText,isShortCode} from './table-values';
import { parseHTML } from 'linkedom';

const escape = (s: string) => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const plain = (node: any): string => node.textContent.trim();
const numeric = (s: string) => /^[−–+-]?\d[\d,.]*(?:\s?%|\s?[×x])?$/.test(s);
const amount = (s: string) => Number(s.replaceAll(',','').replace('−','-'));
export type Visual = { id:string; kind:'table'|'figure'; title:string; html:string; note:string; csv?:string; markdown:string; appendix:boolean; rows?:number; columns?:number };
export type Reading = { html:string; visuals:Visual[] };

function markdown(node: any): string {
  if (node.nodeType===3) return node.textContent;
  if(['SCRIPT','STYLE'].includes(node.tagName))return '';
  if(node.tagName==='TABLE'){const rows=Array.from(node.querySelectorAll('tr')).map((r:any)=>Array.from(r.children).map(c=>markdown(c).replaceAll('|','\\|').replaceAll('\n',' ')));return '\n\n'+rows.map((r,i)=>'| '+r.join(' | ')+' |'+(i===0?'\n| '+r.map(()=>'---').join(' | ')+' |':'')).join('\n')+'\n\n';}
  const inside = Array.from(node.childNodes || []).map(markdown).join('');
  if (node.tagName==='A') return `[${inside}](${node.getAttribute('href')})`;
  if (node.tagName==='IMG') return `![${node.getAttribute('alt') || ''}](${node.getAttribute('src')})`;
  if (['STRONG','B'].includes(node.tagName)) return `**${inside}**`;
  if (['EM','I'].includes(node.tagName)) return `*${inside}*`;
  return ['P','DIV','FIGCAPTION','H2','H3'].includes(node.tagName)?`\n\n${inside.trim()}\n\n`:inside;
}

// Build-time wrappers retain every source cell and link. Tools enhance this complete table.
export function readingSurfaces(html:string,entryId:string):Reading {
  const {document}=parseHTML(`<html><body>${html}</body></html>`);
  const visuals:Visual[]=[];
  let heading:any=null,appendix=false,ti=0,fi=0;
  for(const node of [...document.body.children]){
    if(/^H[23]$/.test(node.tagName)){heading=node;if(plain(node)==='How this was made')appendix=true;continue;}
    const isTable=node.tagName==='TABLE',isFigure=node.tagName==='FIGURE'||node.classList.contains('imglink');
    if(!isTable&&!isFigure)continue;
    const id=isTable?`table-${++ti}`:`figure-${++fi}`;
    const title=!isTable&&node.querySelector('img')?.getAttribute('alt')||heading&&plain(heading)||`${isTable?'Table':'Figure'} ${isTable?ti:fi}`;
    const note=[node.previousElementSibling,node.nextElementSibling].filter(n=>n?.tagName==='P').map(n=>n!.outerHTML).join('');
    let visual:any=node,csv:string|undefined,tableMarkdown='',rows=0,columns=0;
    if(isTable){
      const cells:any[][]=[...node.querySelectorAll('tr')].map(tr=>[...tr.children]);
      const values=cells.map(row=>row.map(plain)),headers=values[0]||[];
      rows=values.length-1;columns=headers.length;
      cells[0]?.forEach(c=>c.setAttribute('scope','col'));
      headers.forEach((_,i)=>{
        const data=values.slice(1).map(r=>r[i]);
        if(data.some(v=>v.length>100))cells.forEach(r=>r[i]?.classList.add('prose-col'));
        else if(data.some(v=>v.length>65))cells.forEach(r=>r[i]?.classList.add('text-col'));
        else cells.forEach(r=>r[i]?.classList.add('short-col'));
        if(data.some(isNumericText)&&data.every(v=>isNumericText(v)||/^[—–-]$/.test(v)))cells.forEach(r=>r[i]?.classList.add('num'));
        if(data.every(v=>isNumericText(v)||isShortCode(v)||/^[—–-]$/.test(v)))cells.forEach(r=>r[i]?.classList.add('nowrap'));
      });
      const counts=entryId==='2026-11-19-decipherment-methods-and-agents'&&title==='Provisional historical coding'&&headers.join('|')==='Provisional code at the selected stage|Yes|Partial|No|Uncertain'&&values.slice(1).every(r=>r.slice(1).every(v=>/^\d+$/.test(v))&&r.slice(1).reduce((s,v)=>s+Number(v),0)===20);
      if(counts)cells.slice(1).forEach(r=>r.slice(1).forEach(c=>{c.classList.add('count-cell');c.style.setProperty('--cell-tint',`${Number(plain(c))/20*22}%`);}));
      csv=values.map(r=>r.map(v=>'"'+v.replaceAll('"','""')+'"').join(',')).join('\r\n')+'\r\n';
      tableMarkdown=markdown(node);
      const wrapper=document.createElement('figure');wrapper.className='reader-table'+(counts?' count-matrix':'');wrapper.dataset.rows=String(rows);
      const caption=document.createElement('figcaption');caption.id=`${id}-caption`;caption.textContent=title;caption.className='sr-only';
      node.setAttribute('aria-labelledby',caption.id);
      const tools=document.createElement('div');tools.className='table-tools';
      tools.innerHTML=`<a href="/${escape(entryId)}/tables/${id}.csv" download title="Download the complete table in source order">CSV</a>`;
      const hint=document.createElement('p');hint.className='table-hint';hint.textContent='Scroll sideways for more columns';
      const scroll=document.createElement('div');scroll.className='table-scroll';scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label',title);if(rows>=8)scroll.classList.add('long-table');
      node.replaceWith(wrapper);scroll.append(node);wrapper.append(caption,tools,hint,scroll);visual=wrapper;
    }else if(node.tagName!=='FIGURE'){
      const wrapper=document.createElement('figure');wrapper.className='reading-image';node.replaceWith(wrapper);wrapper.append(node);visual=wrapper;
    }
    if(!isTable)for(const [n,table] of [...visual.querySelectorAll('table')].entries()){
      const embedded=readingSurfaces(table.outerHTML,entryId).html.replaceAll('table-1',`${id}-table-${n+1}`);
      const {document:part}=parseHTML(`<html><body>${embedded}</body></html>`);
      const wrap=part.body.firstElementChild!;
      const csvLink=wrap.querySelector('a[download]');
      if(visual.querySelector('#sickly-kwic'))csvLink?.setAttribute('href',`/${entryId}/charts/2-sickly-kwic.csv`);
      table.parentElement?.classList.remove('scroll');table.replaceWith(wrap);
    }
    visual.id=id;visual.classList.add('reading-visual');
    visuals.push({id,kind:isTable?'table':'figure',title,html:visual.outerHTML,note,csv,markdown:isTable?tableMarkdown:markdown(node),appendix,rows,columns});
  }
  return {html:document.body.innerHTML,visuals};
}
export function absoluteAssets(html:string,id:string):string {
  return html.replace(/href="#([^"]+)"/g,`href="/${id}/#$1"`).replace(/\b(href|src|data-spec)="(?![a-z]+:|\/|#)([^"]+)"/gi,(_,attr,url)=>`${attr}="/${id}/${url}"`);
}
export function figuresHTML(reading:Reading,id:string):string {
  return reading.visuals.filter(v=>!v.appendix).map(v=>{
    const {document}=parseHTML(`<html><body>${v.html}</body></html>`);
    const visual=document.body.firstElementChild!;visual.removeAttribute('id');
    return `<section class="gallery-item" id="${v.id}"><h2>${escape(v.title)}</h2>${absoluteAssets(visual.outerHTML+`<div class="source-note">${v.note}</div>`,id)}<p class="figure-back"><a href="/${id}/#${v.id}">Back to this place in the text</a></p></section>`;
  }).join('');
}
export function figuresMarkdown(reading:Reading,id:string,title:string):string {
  return `# Figures and tables: ${title}\n\n[Read the complete snack](/${id}/index.md)\n\n`+reading.visuals.filter(v=>!v.appendix).map(v=>{
    const {document}=parseHTML(`<html><body>${v.note}</body></html>`);
    const body=v.markdown+'\n\n'+[...document.body.children].map(markdown).join('\n\n');
    return `## ${v.title}\n\n${body.replace(/\]\(#([^)]+)\)/g,`](/${id}/#$1)`).replace(/\]\((?![a-z]+:|\/|#)([^)]+)\)/gi,(_,url)=>`](/${id}/${url})`)}\n\n${v.csv?`[Table data (CSV)](/${id}/tables/${v.id}.csv) · `:''}[Back to the text](/${id}/#${v.id})\n`;
  }).join('\n');
}
