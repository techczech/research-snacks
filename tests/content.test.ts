import { test, expect } from 'bun:test';
import { mkdtempSync, cpSync, writeFileSync, rmSync, readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { getEntries, parseEntry, privacyErrors, referencesRIS, entryHTML, renderMarkdown, ROOT } from '../src/lib/content';
const entry=getEntries().find(x=>x.id==='2026-11-16-one-in-270-jobs')!;
test('RIS preserves repeated authors and all fields',()=>{
 const text=referencesRIS([{type:'article',authors:['Jane Smith','Doe, John'],title:'A study',container:'Journal',date:'2024-02-03',volume:2,issue:1,pages:'10–20',publisher:'Press',url:'https://example.org/',doi:'10.1234/example'}]);
 for(const line of ['TY  - JOUR','AU  - Smith, Jane','AU  - Doe, John','TI  - A study','T2  - Journal','PY  - 2024','DA  - 2024/02/03','VL  - 2','IS  - 1','SP  - 10','EP  - 20','PB  - Press','UR  - https://example.org/','DO  - 10.1234/example','ER  - '])expect(text.split('\n')).toContain(line);
});
test('RIS types, organisation names and multiline record protection',()=>{
 for(const [type,ris] of Object.entries({report:'RPRT',dataset:'DATA',webpage:'ELEC',post:'ELEC',video:'VIDEO',book:'ELEC'})){
  const text=referencesRIS([{type,title:'Title\nER  - \nTY  - JOUR',authors:['Example Research Group'],corporate:true,year:2025}]);
  expect(text).toContain(`TY  - ${ris}\n`);expect(text).toContain('AU  - Example Research Group\n');expect(text.split('\n').filter(l=>l==='ER  - ')).toHaveLength(1);expect(text).not.toContain('\nTY  - JOUR');
 }
});
test('no references means no RIS link; derived checking link always present',()=>{
 expect(entryHTML({...entry,references:[]})).not.toContain('href="references.ris"');
 for(const x of getEntries())expect(entryHTML(x)).toContain(`href="https://github.com/techczech/research-snacks-data/tree/main/snacks/${x.id}"`);
});
test('private content patterns are rejected',()=>{
 for(const value of ['/Users/example/private','~/private','/home/person/private','C:\\private','private@example.org','example.local','example.lan','MacBook-test','Mac-Studio','javascript:example','data:text/html'])expect(privacyErrors(value,'fixture').length).toBeGreaterThan(0);
});
test('frontmatter validation and recursive privacy checks fail before output',()=>{
 mkdirSync(join(ROOT,'.check'),{recursive:true});const temp=mkdtempSync(join(ROOT,'.check/','fixture-'));const dir=join(temp,entry.id);mkdirSync(dir);
 const original=readFileSync(join(entry._folder,'index.md'),'utf8');
 try{
  writeFileSync(join(dir,'index.md'),original);expect(parseEntry(dir).id).toBe(entry.id);
  const mutations: [string | RegExp,string][] = [[`id: ${entry.id}`,'id: different'],['title:','missing_title:'],[/^date:.*$/m,'date: 2026-02-30'],['tools:','wrong_tools:'],['claim_source:','missing_claim_source:']];
  for(const [before,after] of mutations){
   const changed=original.replace(before,after);expect(changed).not.toBe(original);
   writeFileSync(join(dir,'index.md'),changed);expect(()=>parseEntry(dir)).toThrow();
  }
  writeFileSync(join(dir,'index.md'),original);mkdirSync(join(dir,'data'));writeFileSync(join(dir,'data/private.csv'),'value\nprivate@example.org');expect(()=>parseEntry(dir)).toThrow('email address');
 }finally{rmSync(temp,{recursive:true});}
});
test('Markdown keeps HTML inert, links bare URLs, right-aligns numbers, wraps images and fences code',()=>{
 const html=renderMarkdown('<script>alert(1)</script>\n\nhttps://example.org/a\n\n| Value | Count |\n|---|---|\n| Item | −93% |\n\n![Alt](charts/a.png)\n\n```python\nx = 1\n```');
 expect(html).not.toContain('<script>');expect(html).toContain('href="https://example.org/a"');expect(html).toContain('class="num">−93%');expect(html).toContain('class="imglink"');expect(html).toContain('loading="lazy"');expect(html).toContain('language-python');
});
