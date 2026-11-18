import { getEntries, getAbout, NAME, TAGLINE, BASE, pageCitation, files, ROOT, names } from '../lib/content';
import { citeText } from '../scripts/kit/citation';
import { relative } from 'node:path';
const entries = getEntries();
const index = `# ${NAME}\n\n${TAGLINE}\n\n`+entries.map(x=>`## [${x.title}](${BASE}/${x.id}/)\n\n${x.date}${x.category ? " · "+x.category : ""}\n\nClaim: ${x.claim}\n\nVerdict: ${x.verdict}\n\nTime taken: ${x.time_taken}\n\n${x.summary}\n`).join('\n');
export function getStaticPaths() {
  const pages = [{path:'index',body:index},{path:'about/index',body:getAbout()+'\n\n## Subscribe\n\n[Subscribe (RSS)]('+BASE+'/rss.xml)\n'},{path:'search/index',body:'# Search Research Snacks\n\n'+index}];
  for (const x of entries) pages.push({path:`${x.id}/index`,body:`# ${x.title}\n\nDate: ${x.date}\n\nAuthor: ${names(x.author || "Dominik Lukeš").join(", ")}\n\nClaim: ${x.claim} ([source](${x.claim_source}))\n\nVerdict: ${x.verdict}\n\nTime taken: ${x.time_taken}\n\nHuman time: ${x.human_time}\n\nTools: ${x.tools.join("; ")}\n\nData sources: ${x.data_sources.join("; ")}\n\n${x.summary}\n\n${x._body}\n\n### Check it yourself\n\nhttps://github.com/techczech/research-snacks-data/tree/main/snacks/${x.id}\n\n### References\n\n${(x.references || []).map((r:any)=>`${(r.authors || []).join('; ')}. ${r.title}. ${r.doi ? 'https://doi.org/'+r.doi : r.url || ''}`).join('\n\n')}\n\n### Files\n\n${files(x._folder).filter(f=>!f.endsWith('/index.md')).map(f=>`- [${relative(x._folder,f)}](${BASE}/${x.id}/${relative(x._folder,f)})`).join('\n')}\n\n### Cite this page\n\n${citeText(pageCitation(x.title,`/${x.id}/`,x))}\n`});
  return pages.map(p=>({params:{page:p.path},props:{body:p.body}}));
}
export function GET({props}: {props:{body:string}}) { return new Response(props.body,{headers:{'Content-Type':'text/markdown; charset=utf-8'}}); }
