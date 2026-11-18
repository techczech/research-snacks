import { getEntries, NAME, TAGLINE, getAbout } from '../lib/content';
export function GET() {
  return Response.json({sections:[{slug:'entries',name:'Entries',href:'/'},{slug:'pages',name:'Pages',href:'/search/'}],items:[...getEntries().map(x=>({s:'entries',t:x.title,d:x.summary,u:`/${x.id}/`,k:[x._body,x.category,...(x.tags || [])].filter(Boolean).join(' '),x:x.claim_source})),{s:'pages',t:NAME,d:TAGLINE,u:'/'},{s:'pages',t:'About Research Snacks',d:'How the series works, its inspiration and how to check the research.',u:'/about/',k:getAbout()},{s:'pages',t:'Search Research Snacks',d:'Browse entries and site pages.',u:'/search/'}]});
}
