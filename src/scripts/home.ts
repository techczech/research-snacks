export function initHome(){
 const root=document.querySelector<HTMLElement>('[data-home]');if(!root)return;
 const links=[...root.querySelectorAll<HTMLAnchorElement>('[data-home-subject]')];
 const cards=[...root.querySelectorAll<HTMLElement>('[data-home-card]')];
 const title=root.querySelector<HTMLElement>('#home-list-title')!;
 const count=root.querySelector<HTMLElement>('[data-home-count]')!;
 const description=root.querySelector<HTMLElement>('[data-home-description]')!;
 const defaultTitle=title.querySelector('[data-home-all-label]')!.textContent!;
 const newest=description.textContent!;
 function selected(){
  const url=new URL(location.href);
  const hash=url.hash.startsWith('#subject-')?url.hash.slice(9):'all';
  const value=url.searchParams.get('cat')||hash;
  return links.some(a=>a.dataset.homeSubject===value)?value:'all';
 }
 function render(){
  const subject=selected(),link=links.find(a=>a.dataset.homeSubject===subject)!;
  let n=0;
  cards.forEach(card=>{card.hidden=subject!=='all'&&card.dataset.subject!==subject;if(!card.hidden)n++});
  title.textContent=subject==='all'?defaultTitle:link.dataset.label!;
  count.textContent=`${n} ${n===1?'check':'checks'}`;
  description.textContent=subject==='all'?newest:`${link.dataset.description} · ${newest}`;
  links.forEach(a=>{if(a===link)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 }
 root.classList.add('home-enhanced');render();
 links.forEach(link=>link.addEventListener('click',e=>{
  if(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey||e.button!==0)return;
  e.preventDefault();const url=new URL(location.href);
  if(link.dataset.homeSubject==='all')url.searchParams.delete('cat');else url.searchParams.set('cat',link.dataset.homeSubject!);
  url.hash='';history.pushState(null,'',url);render();
 }));
 addEventListener('popstate',render);addEventListener('hashchange',render);
 const topics=root.querySelector<HTMLDetailsElement>('[data-home-topics]')!;
 const wide=matchMedia('(min-width:760px)');topics.open=wide.matches;
 wide.addEventListener('change',e=>{topics.open=e.matches});
}
