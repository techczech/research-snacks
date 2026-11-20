import {test,expect} from 'bun:test';
import {readFileSync} from 'node:fs';
import {getEntries,researchFiles,researchAssetURL,renderMarkdown} from '../src/lib/content';

test('research links share one mapping in authored text, HTML and Files lists',()=>{
 const id='2026-11-19-hawks-and-doves';
 const url='https://github.com/techczech/research-snacks-data/blob/main/snacks/'+id+'/expected/source-totals.csv';
 expect(researchAssetURL('data/source-totals.csv',id)).toBe(url);
 expect(researchAssetURL('/'+id+'/data/source-totals.csv?raw=1#L2','another-entry')).toBe(url+'?raw=1#L2');
 expect(researchAssetURL(url,id)).toBe(url);
 expect(()=>researchAssetURL('data/not-published.csv',id)).toThrow('no public research-file mapping');
 expect(renderMarkdown('[Totals](data/source-totals.csv)','entries/'+id)).toContain(`href="${url}"`);
 expect(getEntries().flatMap(x=>researchFiles(x.id))).toHaveLength(172);
 const redirects=readFileSync('scripts/assets/_redirects','utf8');
 const rules=redirects.trim().split('\n').map(line=>line.split(' '));
 expect(rules.length).toBeLessThanOrEqual(100);
 for(const entry of getEntries())for(const file of researchFiles(entry.id)){
  const path=`/${entry.id}/${file.path}`;
  const rule=rules.find(([source])=>source===path||source.endsWith('*')&&path.startsWith(source.slice(0,-1)))!;
  expect(rule).toBeDefined();
  expect(rule[1].replace(':splat',path.slice(rule[0].length-1))).toBe(file.url);
 }
 expect(redirects).toContain('/2026-11-17-ai-wealth-control-2035/data/claim-source.md / 302\n');
});

test('the public sickly table shows all 39 curated corpus lines',()=>{
 const text=readFileSync('entries/2026-11-17-can-a-cake-be-sickly/charts/2-sickly-kwic.csv','utf8');
 expect(text.trim().split(/\r?\n/)).toHaveLength(40);
 expect(text.split(/\r?\n/)[0]).toBe('corpus,referent,construction,coordination,reading,left,node,right,reference,token');
 const html=readFileSync('entries/2026-11-17-can-a-cake-be-sickly/charts/2-sickly-kwic.html','utf8');
 expect(html).not.toContain('original-sickly-report.html');
});
