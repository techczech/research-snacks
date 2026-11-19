import {tableValue} from '../lib/table-values';

// Adapted from the Online Reader Framework table-surface: native tables remain the source.
export function initTables(root:ParentNode=document){
  root.querySelectorAll<HTMLElement>('.reader-table').forEach((wrapper,index)=>{
    const table=wrapper.querySelector<HTMLTableElement>('table')!,scroll=wrapper.querySelector<HTMLElement>('.table-scroll')!,tools=wrapper.querySelector<HTMLElement>('.table-tools')!;
    const rows=[...table.tBodies].flatMap(b=>[...b.rows]),headers=[...(table.tHead?.rows[0]?.cells||[])];
    const regular=!table.querySelector('[rowspan]:not([rowspan="1"]),[colspan]:not([colspan="1"])')&&rows.every(r=>r.cells.length===headers.length);
    const titles=headers.map(h=>h.textContent?.trim()||'Column');
    let sortColumn=-1,direction=0;
    const collator=new Intl.Collator('en',{numeric:true,sensitivity:'base'});
    const control=(label:string,action:()=>void)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',action);tools.append(b);return b;};
    const status=document.createElement('span');status.className='table-count';status.setAttribute('role','status');
    const hint=wrapper.querySelector<HTMLElement>('.table-hint')!;
    const updateOverflow=()=>{const wide=scroll.scrollWidth>scroll.clientWidth+1;hint.hidden=!wide;wrapper.classList.toggle('wide-table',wide);};
    new ResizeObserver(updateOverflow).observe(scroll);new ResizeObserver(updateOverflow).observe(table);
    const kwic=wrapper.closest<HTMLElement>('#sickly-kwic');
    const corpus=kwic?.querySelector<HTMLSelectElement>('#sickly-corpus');
    let filter:HTMLInputElement|undefined;
    const empty=document.createElement('p');empty.className='table-empty';empty.hidden=true;empty.append('No rows match. ');
    const clear=document.createElement('button');clear.type='button';clear.textContent='Clear';empty.append(clear);scroll.after(empty);
    const clearMarks=()=>{table.querySelectorAll('mark[data-table-match]').forEach(m=>m.replaceWith(...m.childNodes));table.normalize();};
    const applyFilter=()=>{
      clearMarks();const terms=(filter?.value.trim().toLocaleLowerCase()||'').split(/\s+/).filter(Boolean);let shown=0;
      for(const row of rows){const match=terms.every(term=>row.textContent!.toLocaleLowerCase().includes(term));const include=match&&(!corpus?.value||row.dataset.corpus===corpus.value);row.hidden=regular&&!include;if(include)shown++;}
      if(terms.length){
        const walker=document.createTreeWalker(table,NodeFilter.SHOW_TEXT);const nodes:Text[]=[];while(walker.nextNode())nodes.push(walker.currentNode as Text);
        for(const node of nodes){if(node.parentElement?.closest('thead,tr[hidden]'))continue;
          const value=node.data,lower=value.toLocaleLowerCase(),fragment=document.createDocumentFragment();let from=0,hit=false;
          while(from<value.length){const found=terms.map(t=>({i:lower.indexOf(t,from),len:t.length})).filter(x=>x.i>=0).sort((a,b)=>a.i-b.i)[0];if(!found)break;
            fragment.append(value.slice(from,found.i));const mark=document.createElement('mark');mark.dataset.tableMatch='';mark.textContent=value.slice(found.i,found.i+found.len);fragment.append(mark);from=found.i+found.len;hit=true;}
          if(hit){fragment.append(value.slice(from));node.replaceWith(fragment);}
        }
      }
      status.textContent=regular?`${shown} of ${rows.length}`:`${shown} matching rows`;
      empty.hidden=shown!==0;updateOverflow();
    };
    if(rows.length>=8){filter=kwic?.querySelector<HTMLInputElement>('#sickly-search')||document.createElement('input');filter.type='search';filter.placeholder='Filter rows';filter.setAttribute('aria-label','Filter rows');filter.addEventListener('input',applyFilter);tools.prepend(filter,status);status.textContent=`${rows.length} of ${rows.length}`;if(corpus){tools.append(corpus);corpus.setAttribute('aria-label','Corpus');corpus.addEventListener('change',applyFilter);const exportButton=kwic!.querySelector<HTMLButtonElement>('#sickly-export');if(exportButton)tools.append(exportButton);kwic!.querySelector('.controls')?.remove();kwic!.querySelector('#sickly-count')?.classList.add('sr-only');}}
    clear.onclick=()=>{if(filter){filter.value='';applyFilter();filter.focus();}};
    const reset=control('Source order',()=>sort(-1));reset.className='table-source-order';reset.hidden=true;
    function sort(column:number){
      if(column<0||column===sortColumn&&direction===-1){sortColumn=-1;direction=0;}
      else if(column===sortColumn){direction=-1;}else{sortColumn=column;direction=1;}
      const ordered=[...rows];
      if(direction){const values=rows.map(r=>r.cells[sortColumn].textContent!.trim());const byValue=values.every(v=>tableValue(v)!==null||/^[—–-]?$/.test(v));
        ordered.sort((a,b)=>{const av=a.cells[sortColumn].textContent!.trim(),bv=b.cells[sortColumn].textContent!.trim();
          if(byValue){const an=tableValue(av),bn=tableValue(bv);if(an===null||bn===null)return an===bn?rows.indexOf(a)-rows.indexOf(b):an===null?1:-1;return (an-bn)*direction||rows.indexOf(a)-rows.indexOf(b);}
          return collator.compare(av,bv)*direction||rows.indexOf(a)-rows.indexOf(b);
        });}
      for(const row of ordered)table.tBodies[0].append(row);
      headers.forEach((h,i)=>{h.setAttribute('aria-sort',i===sortColumn?(direction===1?'ascending':'descending'):'none');const arrow=h.querySelector('.sort-arrow');if(arrow)arrow.textContent=i===sortColumn?(direction===1?' ↑':' ↓'):' ↕';});
      reset.hidden=direction===0;applyFilter();
    }
    if(regular&&rows.length>=3)headers.forEach((h,i)=>{const old=h.querySelector('button');const sourceSort=old?.getAttribute('data-sort');if(old)old.replaceWith(...old.childNodes);const b=document.createElement('button');b.type='button';b.className='table-sort';if(sourceSort!==null&&sourceSort!==undefined)b.dataset.sort=sourceSort;while(h.firstChild)b.append(h.firstChild);const arrow=document.createElement('span');arrow.className='sort-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent=' ↕';b.append(arrow);b.title=`Sort by ${titles[i]}`;b.addEventListener('click',()=>sort(i));h.append(b);h.setAttribute('aria-sort','none');});
    // Keep the identity column visible. Native popovers provide Escape and light dismissal.
    if(regular&&rows.length>=8&&headers.length>=5){
      const chooser=document.createElement('div');chooser.className='table-columns';chooser.id=`table-columns-${index}`;chooser.setAttribute('popover','auto');
      const legend=document.createElement('strong');legend.textContent='Visible columns';chooser.append(legend);
      headers.forEach((h,i)=>{const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=true;input.disabled=i===0;input.setAttribute('aria-label',titles[i]);label.append(input,titles[i]);chooser.append(label);input.onchange=()=>{[...table.rows].forEach(r=>r.cells[i].hidden=!input.checked);updateOverflow();};});
      wrapper.append(chooser);
      const button=control('Columns',()=>{const r=button.getBoundingClientRect();chooser.style.left=`${Math.min(r.left,innerWidth-280)}px`;chooser.style.top=`${Math.min(r.bottom+4,innerHeight-300)}px`;chooser.togglePopover();if(chooser.matches(':popover-open'))chooser.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus();});
      button.setAttribute('aria-controls',chooser.id);button.setAttribute('aria-expanded','false');chooser.addEventListener('toggle',()=>{const open=chooser.matches(':popover-open');button.setAttribute('aria-expanded',String(open));if(!open)button.focus();});
    }
    let focusButton:HTMLButtonElement;
    const closeFull=()=>{if(!wrapper.classList.contains('table-full'))return;wrapper.hidePopover();wrapper.removeAttribute('popover');wrapper.classList.remove('table-full');focusButton.textContent='Full view';focusButton.setAttribute('aria-pressed','false');focusButton.focus();updateOverflow();};
    focusButton=control('Full view',()=>{if(wrapper.classList.contains('table-full')){closeFull();return;}wrapper.classList.add('table-full');wrapper.setAttribute('popover','manual');wrapper.showPopover();focusButton.textContent='Close full view';focusButton.setAttribute('aria-pressed','true');updateOverflow();});focusButton.setAttribute('aria-pressed','false');
    wrapper.addEventListener('keydown',e=>{if(e.key==='Escape'&&!wrapper.querySelector('.table-columns:popover-open')){if(wrapper.classList.contains('table-full')){e.preventDefault();closeFull();}else if(e.target===filter&&filter.value){filter.value='';applyFilter();}}});
    // CSV stays the complete canonical table, regardless of the reader's temporary projection.
    tools.append(tools.querySelector('a[download]')!);updateOverflow();
  });
}
