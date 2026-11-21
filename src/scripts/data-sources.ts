export function initDataSources(){
 const root=document.querySelector<HTMLElement>('[data-sources]');if(!root)return;
 const form=root.querySelector<HTMLFormElement>('form')!;
 const query=form.querySelector<HTMLInputElement>('[name=q]')!;
 const access=form.querySelector<HTMLSelectElement>('[name=access]')!;
 const use=form.querySelector<HTMLSelectElement>('[name=use]')!;
 const sort=form.querySelector<HTMLSelectElement>('[name=sort]')!;
 const list=root.querySelector<HTMLElement>('[data-source-list]')!;
 const count=root.querySelector<HTMLElement>('[data-source-count]')!;
 const empty=root.querySelector<HTMLElement>('[data-source-empty]')!;
 const cards=[...list.querySelectorAll<HTMLElement>('[data-source-record]')];
 const fold=(s:string)=>s.normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase('en-GB');
 const searchable=new Map(cards.map(c=>[c,fold([c.dataset.title,c.dataset.provider,c.querySelector('.source-description>p:last-child')?.textContent,c.querySelector('.source-notes')?.textContent].join(' '))]));
 const collator=new Intl.Collator('en-GB',{numeric:true,sensitivity:'base'});
 function render(){
  const terms=fold(query.value).trim().split(/\s+/).filter(Boolean);
  let n=0;
  for(const card of cards){card.hidden=Boolean((access.value&&card.dataset.access!==access.value)||(use.value&&card.dataset.used!==use.value)||!terms.every(t=>searchable.get(card)!.includes(t)));if(!card.hidden)n++}
  const ordered=[...cards].sort((a,b)=>sort.value==='provider'?collator.compare(a.dataset.provider!,b.dataset.provider!)||collator.compare(a.dataset.title!,b.dataset.title!):(sort.value==='title-desc'?-1:1)*collator.compare(a.dataset.title!,b.dataset.title!));
  list.append(...ordered);count.textContent=`${n} of ${cards.length} datasets`;empty.hidden=n!==0;
 }
 function restore(){
  const params=new URL(location.href).searchParams;
  query.value=params.get('q')||'';
  for(const select of [access,use,sort]){const value=params.get(select.name);select.value=[...select.options].some(o=>o.value===value)?value!:(select===sort?'title':'')}
  // An appendix/deep link must always show its target, including after Back.
  if(location.hash&&cards.some(c=>'#'+c.id===location.hash)){query.value='';access.value='';use.value=''}
  render();
 }
 function update(push:boolean){
  const url=new URL(location.href);url.hash='';
  for(const field of [query,access,use,sort]){if(field.value&&(field!==sort||field.value!=='title'))url.searchParams.set(field.name,field.value);else url.searchParams.delete(field.name)}
  if(url.href!==location.href)history[push?'pushState':'replaceState'](null,'',url);
  render();
 }
 form.hidden=false;restore();
 form.addEventListener('submit',e=>{e.preventDefault();update(false)});
 query.addEventListener('input',()=>update(false));
 for(const select of [access,use,sort])select.addEventListener('change',()=>update(true));
 function clear(){query.value='';access.value='';use.value='';sort.value='title';update(true)}
 form.addEventListener('reset',e=>{e.preventDefault();clear()});
 root.querySelector('[data-source-clear]')!.addEventListener('click',()=>{clear();query.focus()});
 addEventListener('popstate',restore);addEventListener('hashchange',restore);
}
