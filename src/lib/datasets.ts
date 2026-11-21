import snapshot from '../../data/datasets.json';
import source from '../../data/datasets-source.json';

export const catalogue=snapshot;
export const catalogueSource=source;
export const accessTypes=['open','free registration','on request','licensed','paid','unclear'] as const;
export const catalogueIntro='Public datasets encountered while checking claims, including those considered but not used. Each record describes what the data holds, how to get it and which Research Snacks used it.';
export const accessKey='Access says how you get the data: open (download or browse without an account), free registration, on request (ask the provider), licensed (accept a user licence or use a licensed service, sometimes free), paid, or unclear (the provider pages could not be verified). Reuse terms differ from access: an open page can still restrict copying.';
type SnackEntry={id:string;title:string};
export function resolveDatasets(entries:SnackEntry[],datasets=catalogue){
 const byId=new Map(entries.map(x=>[x.id,x]));
 const seen=new Set<string>();
 return datasets.map(d=>{
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.id)||seen.has(d.id))throw new Error(`Invalid or duplicate dataset id: ${d.id}`);
  seen.add(d.id);
  if(!accessTypes.includes(d.access as typeof accessTypes[number]))throw new Error(`${d.id}: unknown access type ${d.access}`);
  const snacks=d.snacks.map(s=>{
   const url=new URL(s.url);
   const id=url.pathname.split('/').filter(Boolean)[0];
   const entry=byId.get(id);
   if(url.origin!=='https://researchsnacks.semanticmachines.fyi'||url.pathname!==`/${id}/`||url.search||url.hash||!entry)throw new Error(`${d.id}: no existing snack matches ${s.url}`);
   return {id,title:entry.title,href:`/${id}/`};
  });
  return {...d,snacks};
 }).sort((a,b)=>a.title.localeCompare(b.title,'en-GB',{sensitivity:'base'}));
}
export function datasetsForSnack(id:string){
 return catalogue.filter(d=>d.snacks.some(s=>s.url===`https://researchsnacks.semanticmachines.fyi/${id}/`)).sort((a,b)=>a.title.localeCompare(b.title,'en-GB'));
}
export function datasetsMarkdown(entries:SnackEntry[]){
 return `# Data sources\n\n${catalogueIntro}\n\n${accessKey}\n\n[Catalogue repository](${source.repository}) · [CSV](/data-sources/datasets.csv) · [JSON](/data-sources/datasets.json)\n\n`+resolveDatasets(entries).map(d=>`## ${d.title} {#${d.id}}\n\n[${d.provider}](${d.url})\n\n${d.data}\n\nAccess: ${d.access}. Licence: [${d.licence.name}](${d.licence.url}).\n\n${d.snacks.length?'Used in: '+d.snacks.map(s=>`[${s.title}](${s.href})`).join('; '):'Considered only; not used in a snack.'}\n\nNotes: ${d.notes}\n`).join('\n');
}
