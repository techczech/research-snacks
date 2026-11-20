import {getEntries,names,type Entry} from './content';
export const primaryCategory=(x:Entry)=>x.category||'Research';
export const categoryGroups=()=>{const entries=getEntries();return [...new Set(entries.map(primaryCategory))].map(category=>({category,count:entries.filter(x=>primaryCategory(x)===category).length}));};
export const entryTags=(x:Entry)=>names(x.tags);
export function shortTime(x:Entry):string {
  const s=String(x.time_taken);const minutes=/^(?:About\s+)?(\d+(?:\.\d+)?)\s+minutes/i.exec(s);
  if(minutes)return `${Math.round(Number(minutes[1]))} min`;
  if(/^About an hour/i.test(s))return 'about 1 hr';
  return '';
}
