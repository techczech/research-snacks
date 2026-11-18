import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getEntries, getAbout, referencesRIS, ROOT } from '../src/lib/content';
const entries = getEntries(); getAbout(); // Fail before touching the previous output.
const dest = join(ROOT,'.generated/public');
rmSync(dest,{recursive:true,force:true}); mkdirSync(dest,{recursive:true});
for (const asset of ['style.css','copy.js','_headers']) cpSync(join(ROOT,'scripts/assets',asset),join(dest,asset));
for (const x of entries) {
  cpSync(x._folder,join(dest,x.id),{recursive:true,filter:src => !['index.md','__pycache__','.DS_Store'].includes(src.split('/').at(-1)!)});
  if (x.references?.length) writeFileSync(join(dest,x.id,'references.ris'),referencesRIS(x.references));
}
console.log(`Prepared ${entries.length} entries; privacy checks passed.`);
