import {expect,test} from 'bun:test';
import {getEntries} from '../src/lib/content';
import {catalogue, resolveDatasets, datasetsForSnack} from '../src/lib/datasets';

test('catalogue snack URLs resolve to current internal routes and titles',()=>{
 const entries=getEntries();
 const datasets=resolveDatasets(entries);
 expect(datasets.length).toBeGreaterThan(0);
 for(const d of datasets)for(const s of d.snacks){
  expect(s.href).toBe(`/${s.id}/`);
  expect(s.title).toBe(entries.find(e=>e.id===s.id)!.title);
  expect(datasetsForSnack(s.id).some(x=>x.id===d.id)).toBe(true);
 }
});
test('missing entries and foreign snack URLs stop the build',()=>{
 expect(()=>resolveDatasets([])).toThrow(/no existing snack/);
 const record={...catalogue[0],snacks:[{title:'Bad link',url:'https://example.org/2026-11-19-ai-capex-historical-booms/'}]};
 expect(()=>resolveDatasets(getEntries(),[record])).toThrow(/no existing snack/);
});
