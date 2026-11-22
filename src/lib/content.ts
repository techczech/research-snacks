import {datasetsForSnack} from './datasets';
import {readingSurfaces} from './reading';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { parse as yaml } from 'yaml';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';
import { citeBlockHtml, surnameFirst } from '../scripts/kit/citation';
import researchAssets from './research-assets.json';

export const BASE = 'https://researchsnacks.semanticmachines.fyi';
export const NAME = 'Research Snacks';
export const AUTHOR = 'Dominik Lukeš';
export const TAGLINE = 'Small research experiments with AI agents: how fast can a claim be checked?';
export const ROOT = process.cwd();
export const e = (v: unknown) => String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
export const names = (v: any): string[] => typeof v === 'string' ? [v] : [...(v || [])];
export type Entry = Record<string, any> & { id: string; title: string; date: string; _body: string; _folder: string };
const researchMap: Record<string,Record<string,string>> = researchAssets;
export function researchFiles(id: string): {path:string;url:string}[] {
  return Object.entries(researchMap[id] || {}).sort(([a],[b])=>a.localeCompare(b)).map(([path,target])=>({path,url:`https://github.com/techczech/research-snacks-data/blob/main/${target.split('/').map(encodeURIComponent).join('/')}`}));
}
export function researchAssetURL(url:string,entryId:string):string {
  const resolved=new URL(url,`${BASE}/${entryId}/`);
  if(resolved.origin!==BASE)return url;
  const [,id,...parts]=decodeURIComponent(resolved.pathname).split('/');
  if(!['data','code'].includes(parts[0]))return url;
  const asset=researchFiles(id).find(f=>f.path===parts.join('/'));
  if(!asset)throw new Error(`${id}: no public research-file mapping for ${parts.join('/')}`);
  return asset.url+resolved.search+resolved.hash;
}
export function rewriteResearchLinks(text:string,id:string):string {
  return text.replace(/(\]\(|\b(?:href|src|data-spec)=["'])([^\s"'<>)]*)/g,(_,prefix,url)=>prefix+researchAssetURL(url,id))
    .replace(/https?:\/\/researchsnacks\.semanticmachines\.fyi\/[^\s<>"')\]]+/g,url=>researchAssetURL(url,id));
}
export function files(dir: string): string[] {
  return existsSync(dir) ? readdirSync(dir).sort().flatMap(n => statSync(join(dir,n)).isDirectory() ? files(join(dir,n)) : [join(dir,n)]) : [];
}
const TEXT_EXT = new Set(['.md','.csv','.py','.txt','.json','.yaml','.yml','.tsv','.html','.sh']);
export function privacyErrors(text: string, label: string): string[] {
  const patterns: [RegExp,string,boolean?][] = [
    [/\/Users\/|~\/|\/home\/|[A-Za-z]:\\/, 'an absolute or home path', true],
    [/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+/, 'an email address'],
    [/\b[\w-]+\.(local|lan|internal|home|localdomain)\b|\bmacbook[\w-]*\b|\bmac-?studio[\w-]*\b/i, 'a hostname'],
    [/javascript:|data:text\/html/i, 'a script URL'],
  ];
  return text.split('\n').flatMap((line,i) => {
    // Public URL paths are not filesystem paths; still scan their hosts and other private content.
    const withoutHttpURLs = line.replace(/https?:\/\/[^\s<>"'`),;\]}]+/gi, '');
    return patterns.filter(([rx,,skipHttpURLs]) => rx.test(skipHttpURLs ? withoutHttpURLs : line))
      .map(([,what]) => `${label}:${i+1}: contains ${what}; private material cannot ship`);
  });
}
export function parseEntry(folder: string): Entry {
  const id = folder.split('/').at(-1)!;
  const idx = join(folder,'index.md');
  if (!existsSync(idx)) throw new Error(`${id}: no index.md`);
  const text = readFileSync(idx,'utf8');
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) throw new Error(`${id}/index.md: no YAML frontmatter`);
  const fm = yaml(m[1]);
  if (!fm || typeof fm !== 'object' || Array.isArray(fm)) throw new Error(`${id}: frontmatter is not a mapping`);
  const errors: string[] = [];
  for (const k of ['id','title','date','claim','claim_source','verdict','time_taken','human_time','tools','data_sources','summary']) {
    if (fm[k] == null || fm[k] === '' || (Array.isArray(fm[k]) && !fm[k].length)) errors.push(`${id}/index.md: missing required field '${k}'`);
  }
  if (fm.id !== id) errors.push(`${id}/index.md: id does not match folder name`);
  if (!/^\d{4}-\d{2}-\d{2}-.+$/.test(String(fm.id))) errors.push(`${id}: id must look like YYYY-MM-DD-slug`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(fm.date)) || !Number.isFinite(Date.parse(fm.date)) || new Date(fm.date).toISOString().slice(0,10) !== fm.date) errors.push(`${id}: date must be YYYY-MM-DD`);
  for (const k of ['tools','data_sources']) if (!Array.isArray(fm[k])) errors.push(`${id}: ${k} must be a list`);
  if (Array.isArray(fm.tools) && fm.tools.some((tool: unknown) => /\b(?:Astro|bun|Cloudflare|Chromium|wrangler|Playwright|static[- ]site builder)\b/i.test(String(tool)))) errors.push(`${id}: tools must list research tools, not page build, rendering or publishing tools`);
  if (fm.references != null && (!Array.isArray(fm.references) || fm.references.some((r: any) => !r || Array.isArray(r) || typeof r !== 'object' || !r.title))) errors.push(`${id}: references must be a list of mappings, each with a title`);
  if (!/^https?:\/\//.test(String(fm.claim_source))) errors.push(`${id}: claim_source must be an HTTP URL`);
  for (const file of files(folder)) if (TEXT_EXT.has(extname(file).toLowerCase())) errors.push(...privacyErrors(readFileSync(file,'utf8'),`${id}/${relative(folder,file)}`));
  if (errors.length) throw new Error(`BUILD FAILED:\n  ${errors.join('\n  ')}`);
  const rewriteValue=(value:any):any=>typeof value==='string'?rewriteResearchLinks(value,id):Array.isArray(value)?value.map(rewriteValue):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,rewriteValue(v)])):value;
  return {...rewriteValue(fm), date: String(fm.date), _body:rewriteResearchLinks(m[2].trim(),id), _folder:folder};
}
export function getEntries(): Entry[] {
  const root = join(ROOT,'entries');
  return readdirSync(root).filter(n => statSync(join(root,n)).isDirectory()).map(n => parseEntry(join(root,n))).sort((a,b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}
export function getAbout() {
  const text = readFileSync(join(ROOT,'content/about.md'),'utf8');
  const errors = privacyErrors(text,'content/about.md');
  if (errors.length) throw new Error(errors.join('\n'));
  return text;
}
export const firstParagraph = (text: string) => text.trim().split(/\n\s*\n/).find(p => p.trim() && !p.startsWith('#')) || '';
export const dateLabel = (date: string, month: 'long'|'short' = 'long') => new Intl.DateTimeFormat('en-GB',{day:'numeric',month,year:'numeric',timeZone:'UTC'}).format(new Date(date));
export const cssVersion = createHash('sha1').update(readFileSync(join(ROOT,'scripts/assets/style.css'))).digest('hex').slice(0,8);
export const pageCitation = (title: string, path: string, x?: Entry) => ({title, url:BASE+path, site:NAME, authors:names(x?.author || AUTHOR), ...(x ? {date:x.date} : {})});
export const firstChart = (x: Entry) => files(join(x._folder,'charts')).filter(f => /\.(png|jpe?g|webp|svg)$/i.test(f))[0]?.split('/').at(-1);

export function referencesRIS(refs: Record<string,any>[]): string {
  const types: Record<string,string> = {article:'JOUR', report:'RPRT', dataset:'DATA', webpage:'ELEC',post:'ELEC',video:'VIDEO'};
  return refs.map(ref => {
    const lines: string[] = [];
    const add = (tag: string,value: any) => { if (value != null && String(value).trim()) lines.push(`${tag}  - ${String(value).split(/\r?\n/).join(' ').trim()}`); };
    add('TY',types[ref.type || 'webpage'] || 'ELEC');
    for (const author of names(ref.authors)) add('AU',ref.corporate ? author : surnameFirst(author));
    add('TI',ref.title); add('T2',ref.container);
    const published = String(ref.date || ref.year || ''); add('PY',published.slice(0,4));
    if (ref.date) add('DA',published.replaceAll('-','/'));
    for (const [tag,key] of [['VL','volume'],['IS','issue'],['PB','publisher'],['CY','place'],['UR','url'],['DO','doi'],['N1','note']]) add(tag,ref[key]);
    if (ref.pages) { const pages = String(ref.pages).split(/[–—-](.*)/s); add('SP',pages[0]); if (pages.length>1) add('EP',pages[1]); }
    lines.push('ER  - '); return lines.join('\n');
  }).join('\n\n')+'\n';
}
export function referenceText(ref: Record<string,any>): string {
  let authors = names(ref.authors);
  let who: string;
  if (ref.corporate || !authors.length) who = authors.join(', ') || ref.publisher || '';
  else { authors = [surnameFirst(authors[0]),...authors.slice(1)]; who = authors.length===1 ? authors[0] : authors.slice(0,-1).join(', ')+' and '+authors.at(-1); }
  const year = String(ref.year || String(ref.date || '').slice(0,4));
  let title = e(ref.title); const stop = /[?!.]$/.test(title) ? '' : '.';
  title = ref.type === 'article' ? `&ldquo;${title}${stop}&rdquo;` : `<i>${title}</i>${stop}`;
  const bits = [`${e(who)} (${e(year)}).`,title];
  if (ref.container) {
    let c = e(ref.container);
    if (ref.type === 'article') { c = `<i>${c}</i>`; if (ref.volume) c += ` ${e(ref.volume)}`+(ref.issue ? `(${e(ref.issue)})` : ''); if (ref.pages) c += `: ${e(ref.pages)}`; }
    bits.push(c+'.');
  }
  if (ref.note) bits.push(e(ref.note)+'.');
  if (ref.publisher && ref.type !== 'article') bits.push((ref.place ? e(ref.place)+': ' : '')+e(ref.publisher)+'.');
  const link = ref.doi ? `https://doi.org/${ref.doi}` : ref.url;
  if (link) bits.push(`<a href="${e(link)}">${e(link)}</a>`);
  return bits.join(' ');
}

// These snippets are authored, reviewed code in the same entry source, rather than runtime/imported HTML.
// Preserve their scripts (the KWIC sorter/export) exactly as the Python build did. Markdown raw HTML is escaped.
function interactiveFigure(folder: string, path: string, name: string, alt: string): string | null {
  const card = join(folder,'charts',name+'.html');
  if (existsSync(card)) return `<figure class="infographic" aria-label="${alt}">${readFileSync(card,'utf8')}<figcaption><a href="${path}.png">Image (PNG)</a></figcaption></figure>`;
  if (!existsSync(join(folder,'charts',name+'.vl.json'))) return null;
  const links = existsSync(join(folder,'charts',name+'.csv')) ? [`<a href="charts/${name}.csv" download>Data (CSV)</a>`] : [];
  links.push(`<a href="${path}.png">Image (PNG)</a>`,`<a href="charts/${name}.vl.json">Chart spec (Vega-Lite)</a>`);
  return `<figure class="ichart"><div class="vl" data-spec="charts/${name}.vl.json" data-name="${name}" role="img" aria-label="${alt}"></div><img class="fallback" src="${path}.png" alt="${alt}" loading="lazy"><figcaption>Interactive: hover for numbers; click the legend to pick a group; ⋯ menu saves SVG or PNG. ${links.join(' · ')}</figcaption></figure>`;
}
export function renderMarkdown(text: string,folder?: string): string {
  text = text.replaceAll('&','&amp;').replaceAll('<','&lt;');
  let html = micromark(text,{extensions:[gfm()],htmlExtensions:[gfmHtml()]});
  html = html.replace(/<(td|th)([^>]*)>([−\-–+]?[\d,.]+%?(?: \(\d{4}\))?|–|0)<\/\1>/g,'<$1$2 class="num">$3</$1>');
  html = html.replace(/<img ([^>]*?)src="([^"]+)"([^>]*?)\s*\/?>/g,'<a class="imglink" href="$2"><img $1src="$2"$3 loading="lazy"></a>');
  html = html.replace(/<p>(<a class="imglink"[\s\S]*?<\/a>)<\/p>/g,'$1');
  if (folder) html = html.replace(/<a class="imglink" href="(charts\/([^"/]+))\.png"><img [^>]*?alt="([^"]*)"[^>]*><\/a>/g,(whole,path,name,alt) => interactiveFigure(folder,path,name,alt) || whole);
  // Match Python Markdown's stable heading ids, including accents/underscore behaviour.
  const used = new Set<string>();
  html = html.replace(/<(h[1-6])>(.*?)<\/\1>/g,(whole,tag,inner) => {
    const base = inner.replace(/<[^>]+>/g,'').normalize('NFKD').replace(/[^\x00-\x7f]/g,'').toLowerCase().replace(/[^\w\s-]/g,'').trim().replace(/[\s-]+/g,'-');
    let id=base, n=1; while (used.has(id)) id=`${base}_${n++}`; used.add(id); return `<${tag} id="${id}">${inner}</${tag}>`;
  });
  return folder?rewriteResearchLinks(html,folder.split('/').at(-1)!):html;
}
export function withTOC(html: string,title: string,entryId?:string): string {
  const items: {tag:string;id:string;text:string}[] = [], used = new Set<string>();
  html = html.replace(/<(h2|h3)((?:\s[^>]*?)?)>([\s\S]*?)<\/\1>/g,(_,tag,attrs,inner) => {
    const found = /id="([^"]+)"/.exec(attrs);
    let id=found?.[1] || inner.replace(/<[^>]+>/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'section';
    while (used.has(id)) id += '-2'; used.add(id);
    items.push({tag,id,text:inner.replace(/<[^>]+>/g,'')});
    return `<${tag}${found ? attrs : attrs+` id="${id}"`}>${inner}</${tag}>`;
  });
  if (items.length<3) return `<main id="main" class="wrap entry" style="padding-top:40px">${html.replace('<!--mobile-contents-->','')}</main>`;
  const groups: {head:typeof items[number]; subs: typeof items}[] = [];
  for (const item of items) { if (item.tag==='h2' || !groups.length) groups.push({head:item,subs:[]}); else groups.at(-1)!.subs.push(item); }
  const lis = groups.map(({head,subs}) => `<li class="h2 ${head.text==='How this was made' ? 'making' : ''}"><a href="#${head.id}">${head.text}</a>${subs.length ? '<ol>'+subs.map(s=>`<li class="h3"><a href="#${s.id}">${s.text}</a></li>`).join('')+'</ol>' : ''}</li>`).join('');
  const nav=`<li class="h2 top"><a href="#top">${e(title)}</a></li>${lis}`;
  const compact=`<details class="toc-m"><summary>Contents</summary><ol>${nav}</ol></details>`;
  html=html.includes('<!--mobile-contents-->')?html.replace('<!--mobile-contents-->',compact):compact+html;
  return `<div class="wrap withtoc" id="top"><aside class="toc"><nav aria-label="Contents"><div class="toc-h">Contents</div><ol>${nav}</ol>${entryId?`<p class="figures-link"><a href="/${entryId}/figures/">Figures and tables</a></p>`:''}</nav></aside><main id="main" class="entry">${html}</main></div>`;
}
export function entryHTML(x: Entry): string {
  const ul = (items: any[]) => '<ul>'+items.map(i => `<li>${String(i).startsWith('http') ? `<a href="${e(i)}">${e(i)}</a>` : e(i)}</li>`).join('')+'</ul>';
  const isTool = x.kind === 'tool';
  const entryURL = `${BASE}/${x.id}/`;
  const claimSource = x.claim_source.startsWith(entryURL + '#') ? x.claim_source.slice(entryURL.length) : x.claim_source;
  const facts = `<dl class="facts"><dt>${isTool ? 'Request' : 'Claim'}</dt><dd>&ldquo;${e(x.claim)}&rdquo; (<a href="${e(claimSource)}">source</a>)</dd><dt>${isTool ? 'Result' : 'Verdict'}</dt><dd>${e(x.verdict)}</dd><dt>Time taken</dt><dd>${e(x.time_taken)}</dd><dt>Human time</dt><dd>${e(x.human_time)}</dd><dt>Tools</dt><dd>${ul(x.tools)}</dd><dt>Data sources</dt><dd>${ul(x.data_sources)}</dd></dl>`;
  let rendered = readingSurfaces(renderMarkdown(x._body,x._folder),x.id).html;
  const split = /<h2[^>]*>How this was made<\/h2>/.exec(rendered);
  let argument = split ? rendered.slice(0,split.index) : rendered;
  if (isTool) {
    // Only an explicitly marked link to a bundled tool can become an iframe.
    argument = argument.replace(/(<p><a href="(\/tools\/[a-z0-9-]+\/)" title="Embed interactive tool">([^<>]+)<\/a><\/p>)/g,
      (link, _, path: string, label: string) => {
        if (!existsSync(join(ROOT, 'scripts/assets', path, 'index.html'))) throw new Error(`${x.id}: missing bundled tool ${path}`);
        return `${link}<iframe class="tool-embed" title="${label.replace(/^Open the /, '').replace(/ full-page$/, '')}" src="${path}?embed=1" loading="lazy" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox${path === '/tools/medicine-training-routes/' ? ' allow-downloads' : ''}"></iframe>`;
      });
  }
  const making = split ? rendered.slice(split.index+split[0].length) : '';
  const refs = (x.references || []).map((r: any) => `<li>${referenceText(r)}</li>`).join('');
  const assets = [['data','Data'],['code','Code']].map(([sub,label]) => {
    const listed=researchFiles(x.id).filter(f=>f.path.startsWith(sub+'/'));
    return listed.length ? `<h4>${label}</h4><ul class="assets">${listed.map(f => `<li><a href="${e(f.url)}">${e(f.path)}</a></li>`).join('')}</ul>` : '';
  }).join('');
  const datasets = datasetsForSnack(x.id);
  const sources = datasets.length ? '<h3>Data sources</h3><ul>'+datasets.map(d=>`<li><a href="/data-sources/#${e(d.id)}">${e(d.title)}</a> · ${e(d.provider)}</li>`).join('')+'</ul>' : '';
  const cite = citeBlockHtml(pageCitation(x.title,`/${x.id}/`,x)).replace(/<h2( [^>]*)?>Cite this page<\/h2>/,'<h3$1>Cite this page</h3>');
  return withTOC(`<div class="legend">${dateLabel(x.date)} · ${e(names(x.author || AUTHOR).join(', '))}</div><h1>${e(x.title)}</h1><div class="meta-links"><a href="figures/">Figures and tables</a></div>${facts}<!--mobile-contents--><div class="body-md">${argument}</div><section class="making"><h2 class="making-h">How this was made</h2><p class="making-intro">How the check was done, what it cost, and the sources, data and code behind it.</p><div class="body-md">${making}</div>${sources}<h3>Check it yourself</h3><p><a href="https://github.com/techczech/research-snacks-data/tree/main/snacks/${e(x.id)}">Clone the data, code and method for this snack</a>. The checking repository includes the shareable inputs, expected tables and rerun instructions. The whole collection is archived on Zenodo: <a href="https://doi.org/10.5281/zenodo.24370344">doi:10.5281/zenodo.24370344</a>.</p>${refs ? `<h3>References</h3><ol class="refs">${refs}</ol><p><a href="references.ris">Add these references to your reference manager (RIS)</a></p>` : ''}${assets ? '<h3>Files</h3>'+assets : ''}${cite}</section>`,x.title,x.id);
}
export function categories(x: Entry): string[] { return [...new Set([...(x.category ? [String(x.category)] : []),...names(x.tags)])]; }
