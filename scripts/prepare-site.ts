import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getEntries, getAbout, referencesRIS, ROOT, renderMarkdown } from '../src/lib/content';
import {readingSurfaces} from '../src/lib/reading';
const entries = getEntries(); getAbout(); // Fail before touching the previous output.
const dest = join(ROOT,'.generated/public');
rmSync(dest,{recursive:true,force:true}); mkdirSync(dest,{recursive:true});
for (const asset of ['style.css','copy.js','_headers','_redirects']) cpSync(join(ROOT,'scripts/assets',asset),join(dest,asset));
for(const name of ['house','compact'])cpSync(join(ROOT,'src/styles',name+'.css'),join(dest,name+'.css'));
for (const x of entries) {
  cpSync(x._folder,join(dest,x.id),{recursive:true,filter:src => !['index.md','__pycache__','.DS_Store'].includes(src.split('/').at(-1)!)});
  const reading=readingSurfaces(renderMarkdown(x._body,x._folder),x.id);
  mkdirSync(join(dest,x.id,'tables'),{recursive:true});
  for(const v of reading.visuals)if(v.csv)writeFileSync(join(dest,x.id,'tables',v.id+'.csv'),v.csv);
  if (x.references?.length) writeFileSync(join(dest,x.id,'references.ris'),referencesRIS(x.references));
}
console.log(`Prepared ${entries.length} entries; privacy checks passed.`);
