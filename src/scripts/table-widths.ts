// Keep native auto table layout. Redistribute only space which the displayed text
// demonstrably does not use; percentages are recalculated for the current frame.
export function balanceTableWidths(table:HTMLTableElement){
  table.querySelector('colgroup[data-content-widths]')?.remove();
  if(table.querySelector('colgroup'))return;
  const first=table.tHead?.rows[0];if(!first)return;
  const columns=[...first.cells].map((cell,index)=>({index,width:cell.getBoundingClientRect().width,spare:Infinity,lines:0,hidden:cell.hidden}));
  for(const row of table.rows)if(!row.hidden)for(const [index,cell] of [...row.cells].entries()){
    const column=columns[index];if(!column||column.hidden)continue;
    const bounds=cell.getBoundingClientRect(),style=getComputedStyle(cell),lines=new Map<number,{left:number;right:number}>();
    const walker=document.createTreeWalker(cell,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){
      const node=walker.currentNode;if(!node.textContent?.trim())continue;
      const range=document.createRange();range.selectNodeContents(node);
      for(const rect of range.getClientRects()){
        if(rect.width<.1)continue;const y=Math.round(rect.top),line=lines.get(y);
        lines.set(y,{left:Math.min(line?.left??Infinity,rect.left),right:Math.max(line?.right??-Infinity,rect.right)});
      }
    }
    const used=Math.max(0,...[...lines.values()].map(line=>line.right-line.left));
    const content=bounds.width-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)-parseFloat(style.borderRightWidth);
    column.spare=Math.min(column.spare,Math.max(0,content-used));column.lines=Math.max(column.lines,lines.size);
  }
  const visible=columns.filter(c=>!c.hidden),target=visible.filter(c=>c.lines>=4).sort((a,b)=>b.lines-a.lines||a.spare-b.spare)[0];
  if(!target)return;
  const donors=visible.filter(c=>c!==target&&Number.isFinite(c.spare)).map(c=>({column:c,space:Math.max(0,Math.floor(c.spare-1))}));
  const available=donors.reduce((total,c)=>total+c.space,0);if(available<4)return;
  for(const donor of donors)donor.column.width-=donor.space;
  target.width+=available;
  const total=visible.reduce((sum,c)=>sum+c.width,0),group=document.createElement('colgroup');group.dataset.contentWidths='';
  for(const column of columns){const col=document.createElement('col');if(column.hidden)col.style.display='none';else col.style.width=`${column.width/total*100}%`;group.append(col);}
  table.prepend(group);
}
