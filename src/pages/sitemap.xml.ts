import {BASE,e,getEntries,names} from '../lib/content';
import {primaryCategory} from '../lib/feed';

export function GET() {
  const entries=getEntries();
  const tags=[...new Set(entries.flatMap(x=>[primaryCategory(x),...names(x.tags)]))];
  const paths=['/','/about/','/search/',...entries.flatMap(x=>[`/${x.id}/`,`/${x.id}/figures/`]),...tags.map(tag=>`/tags/${tag}/`)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path=>`\n<url><loc>${e(BASE+path)}</loc></url>`).join('')}\n</urlset>\n`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
