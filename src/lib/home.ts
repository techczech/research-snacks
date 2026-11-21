import {readFileSync} from 'node:fs';
import {parse} from 'yaml';
import {getEntries,names,ROOT,type Entry} from './content';
import {tagLabel} from './labels';

type Subject={id:string;label:string;description:string;count?:number};
type Discovery={subject:string;question:string;finding:string};
type HomeCopy={intro:string;labels:Record<string,string>;subjects:Subject[];entries:Record<string,Discovery>};
export function getHomeData(entries:Entry[]=getEntries()) {
 const source=readFileSync(`${ROOT}/content/front-page.md`,'utf8');
 const copy=parse(source.split('---')[1]) as HomeCopy;
 const subjects=copy.subjects.map(s=>({...s,count:0}));
 const items=entries.map(entry=>{
  const discovery=copy.entries[entry.id];
  const subject=discovery?.subject || copy.subjects.find(s=>s.id===entry.category)?.id || 'other-research';
  if(!subjects.some(s=>s.id===subject))subjects.push({id:subject,label:'Other research',description:'Further evidence checks',count:0});
  subjects.find(s=>s.id===subject)!.count++;
  return {...entry,subject,question:discovery?.question || entry.title,finding:discovery?.finding || entry.verdict};
 });
 const counts=new Map<string,number>();
 // Tag pages include a matching authored category as well as explicit tags.
 for(const entry of entries)for(const tag of new Set([...(entry.category?[String(entry.category)]:[]),...names(entry.tags)]))counts.set(tag,(counts.get(tag)||0)+1);
 const tags=[...counts].map(([tag,count])=>({tag,count,label:tagLabel(tag)})).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label,'en-GB'));
 return {copy,items,subjects:subjects.filter(s=>s.count),tags};
}
