import { getEntries, BASE } from '../lib/content';
export function GET() {
  return new Response(`# Research Snacks\n\n> Small research experiments with AI agents: how fast can a claim be checked?\n\nMarkdown is the content source. Each snack reports the claim, result, method, timing and limits.\n\n## Site\n\n- [Entries](${BASE}/index.md)\n- [About](${BASE}/about/index.md)\n- [Search](${BASE}/search/index.md)\n- [RSS](${BASE}/rss.xml)\n- [Public search index](${BASE}/search-index.json)\n\n## Snacks\n\n${getEntries().map(x=>`- [${x.title}](${BASE}/${x.id}/index.md): ${x.summary}`).join('\n')}\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
