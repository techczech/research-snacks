import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {parse} from 'yaml';import {join,dirname} from 'node:path';
const dir=dirname(new URL(import.meta.url).pathname),images=process.argv[2];
if(!images)throw new Error('Pass the review image directory.');
const source=parse(readFileSync(join(dir,'copy-front-page-b-walkthrough.md'),'utf8').split('---')[1]);
const drawings=join(dir,'drawings-b');mkdirSync(drawings,{recursive:true});
writeFileSync(join(dir,'contracts-front-page-b.json'),JSON.stringify(source.contracts,null,2)+'\n');
for(const [id,html] of Object.entries(source.drawings))writeFileSync(join(drawings,id+'.html'),String(html).replace(/IMAGE:([\w.-]+\.png)/g,(_,name)=>'data:image/png;base64,'+readFileSync(join(images,name)).toString('base64')));
writeFileSync(join(drawings,'_drawing.css'),source.css);
