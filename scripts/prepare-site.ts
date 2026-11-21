import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getEntries, getAbout, referencesRIS, ROOT, renderMarkdown } from '../src/lib/content';
import {readingSurfaces} from '../src/lib/reading';
const entries = getEntries(); getAbout(); // Fail before touching the previous output.
const dest = join(ROOT,'.generated/public');
rmSync(dest,{recursive:true,force:true}); mkdirSync(dest,{recursive:true});
for (const asset of ['style.css','copy.js','_headers','_redirects']) cpSync(join(ROOT,'scripts/assets',asset),join(dest,asset));
cpSync(join(ROOT,'scripts/assets/tools'),join(dest,'tools'),{recursive:true});
for(const name of ['house','compact'])cpSync(join(ROOT,'src/styles',name+'.css'),join(dest,name+'.css'));
for (const x of entries) {
  const unexpected=readdirSync(x._folder).filter(n=>!['index.md','charts','.DS_Store'].includes(n));
  if(unexpected.length)throw new Error(`${x.id}: entries contain only index.md and charts/; put research files in the checking repository`);
  mkdirSync(join(dest,x.id),{recursive:true});
  if(existsSync(join(x._folder,'charts')))cpSync(join(x._folder,'charts'),join(dest,x.id,'charts'),{recursive:true});
  const reading=readingSurfaces(renderMarkdown(x._body,x._folder),x.id);
  mkdirSync(join(dest,x.id,'tables'),{recursive:true});
  for(const v of reading.visuals)if(v.csv)writeFileSync(join(dest,x.id,'tables',v.id+'.csv'),v.csv);
  if (x.references?.length) writeFileSync(join(dest,x.id,'references.ris'),referencesRIS(x.references));
}
console.log(`Prepared ${entries.length} entries; privacy checks passed.`);
