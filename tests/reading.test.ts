import {test,expect} from 'bun:test';
import {parseHTML} from 'linkedom';
import {getEntries,renderMarkdown} from '../src/lib/content';
import {readingSurfaces,figuresMarkdown} from '../src/lib/reading';
import {tableValue} from '../src/lib/table-values';
const cells=(html:string)=>[...parseHTML(`<html><body>${html}</body></html>`).document.querySelectorAll('table')].map(t=>[...t.querySelectorAll('tr')].map(r=>[...r.children].map(c=>({text:c.textContent,links:[...c.querySelectorAll('a')].map(a=>a.getAttribute('href'))}))));
test('all source tables retain exact cells, inline links and order after wrapping',()=>{
 let total=0;
 for(const entry of getEntries()){const source=renderMarkdown(entry._body,entry._folder),reading=readingSurfaces(source,entry.id);expect(cells(reading.html)).toEqual(cells(source));total+=reading.visuals.filter(v=>v.kind==='table').length;
 expect(reading.html).not.toContain('cell-bar');expect(reading.html).not.toContain('visual-links');
 for(const v of reading.visuals.filter(v=>v.csv)){expect(v.csv!.split('\r\n').filter(Boolean).length).toBe(v.rows!+1);expect(v.csv).toContain('"');}
 expect(figuresMarkdown(reading,entry.id,entry.title)).toContain('Back to the text');}
 expect(total).toBe(84);
});
test('numbers, currency, dates and year ranges sort by value',()=>{
 expect(tableValue('48.4%')).toBe(48.4);expect(tableValue('£2,400')).toBe(2400);expect(tableValue('−93')).toBe(-93);expect(tableValue('(24.5)')).toBe(-24.5);expect(tableValue('1.2 billion')).toBe(1.2e9);expect(tableValue('1990–2024')).toBe(1990);expect(tableValue('1990s')).toBe(1990);expect(tableValue('17 December 1964')).toBe(Date.UTC(1964,11,17));expect(tableValue('unrecorded')).toBeNull();expect(tableValue('$9.9bn')).toBe(9.9e9);expect(tableValue('$9.11bn')).toBe(9.11e9);expect(tableValue('About £130,000')).toBe(130000);expect(tableValue('£1.2tn')).toBe(1.2e12);
});
