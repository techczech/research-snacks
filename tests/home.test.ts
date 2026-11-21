import {test,expect} from 'bun:test';
import {readFileSync} from 'node:fs';
import {parseHTML} from 'linkedom';
import {getEntries,names} from '../src/lib/content';
const document=parseHTML(readFileSync('site/index.html','utf8')).document;

test('the home All view includes every check once in date-descending order',()=>{
 const cards=Array.from(document.querySelectorAll('[data-home-card]'));
 expect(cards.map(c=>c.getAttribute('data-entry-id'))).toEqual(getEntries().map(x=>x.id));
 expect(cards.every(c=>!!c.querySelector('.finding')?.textContent?.trim())).toBe(true);
});
test('the prominent search uses the shared search route and accepts a query without JavaScript',()=>{
 const form=document.querySelector<HTMLFormElement>('[data-home-search]');
 expect(form?.getAttribute('action')).toBe('/search/');
 expect(form?.querySelector('input[name=q][type=search]')).not.toBeNull();
 expect(form?.querySelector('button[type=submit]')).not.toBeNull();
});
test('the tag cloud exposes actual tags with accurate counts and working tag routes',()=>{
 const entries=getEntries();
 const tags=[...new Set(entries.flatMap(x=>[...(x.category?[String(x.category)]:[]),...names(x.tags)]))];
 const links=Array.from(document.querySelectorAll('[data-topic-tag]'));
 expect(links).toHaveLength(tags.length);
 for(const tag of tags){
  const link=links.find(x=>x.getAttribute('data-topic-tag')===tag);
  expect(link?.getAttribute('href')).toBe(`/tags/${encodeURIComponent(tag)}/`);
  expect(Number(link?.getAttribute('data-count'))).toBe(entries.filter(x=>x.category===tag||names(x.tags).includes(tag)).length);
 }
});

test('each cloud count matches the collection reached by its link',()=>{
 for(const link of document.querySelectorAll('[data-topic-tag]')){
  const tag=link.getAttribute('data-topic-tag')!;
  const target=parseHTML(readFileSync(`site/tags/${tag}/index.html`,'utf8')).document;
  expect(Number(link.getAttribute('data-count'))).toBe(target.querySelectorAll('.feed-entry').length);
 }
});
