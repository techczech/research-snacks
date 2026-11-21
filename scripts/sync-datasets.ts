import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdirSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';

const destination=resolve(import.meta.dir,'../data');
const lockPath=join(destination,'datasets-source.json');
const [repository,revision]=process.argv.slice(2);
if(!repository){console.error('Usage: bun scripts/sync-datasets.ts CATALOGUE_CHECKOUT [COMMIT]');process.exit(1)}
const previous=existsSync(lockPath)?JSON.parse(readFileSync(lockPath,'utf8')):null;
const commit=execFileSync('git',['-C',resolve(repository),'rev-parse','--verify',`${revision || previous?.commit || 'HEAD'}^{commit}`],{encoding:'utf8'}).trim();
// Read committed blobs, never the checkout's possibly edited generated files.
const blobs=Object.fromEntries(['datasets.json','datasets.csv'].map(name=>[name,execFileSync('git',['-C',resolve(repository),'show',`${commit}:${name}`])]));
const datasets=JSON.parse(blobs['datasets.json'].toString());
if(!Array.isArray(datasets)||!datasets.length)throw new Error('Expected a non-empty dataset catalogue');
mkdirSync(destination,{recursive:true});
for(const [name,bytes] of Object.entries(blobs))writeFileSync(join(destination,name),bytes);
writeFileSync(lockPath,JSON.stringify({repository:'https://github.com/techczech/research-datasets',commit,sha256:Object.fromEntries(Object.entries(blobs).map(([name,bytes])=>[name,createHash('sha256').update(bytes).digest('hex')]))},null,2)+'\n');
console.log(`Synced ${datasets.length} datasets at ${commit}. Review the diff, then run bun run check.`);
