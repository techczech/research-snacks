import {readFileSync,writeFileSync} from 'node:fs';
import {parse} from 'yaml';
import {dirname,join} from 'node:path';
const dir=dirname(new URL(import.meta.url).pathname);
const data=parse(readFileSync(join(dir,'copy-front-page-walkthrough.md'),'utf8').split('---')[1]);
writeFileSync(join(dir,'contracts-front-page.json'),JSON.stringify(data.contracts,null,2)+'\n');
for(const [name,html] of Object.entries(data.drawings))writeFileSync(join(dir,'drawings',name+'.html'),html as string);
writeFileSync(join(dir,'drawings','_drawing.css'),data.css);
